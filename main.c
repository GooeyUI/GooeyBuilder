#include "third_party/pico_logger/pico_logger.h"
#include "webview/webview.h"
#include <Gooey/common/gooey_common.h>
#include <Gooey/core/gooey_timers.h>
#include <Gooey/core/gooey_window.h>
#include <Gooey/gooey.h>
#include <Gooey/widgets/gooey_image.h>
#include <GLPS/glps_thread.h>
#include <GLPS/glps_window_manager.h>
#include <ctype.h>
#include <errno.h>
#include <limits.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>
#include <sys/wait.h>

#define MAX_FILE_SIZE (10 * 1024 * 1024)
#define MAX_CMD_LENGTH 2048
#define SAFE_DIR "tmp"

char *read_file(const char *filename, size_t *out_len)
{
  if (!filename)
  {
    LOG_ERROR("Null filename provided\n");
    return NULL;
  }

  FILE *f = fopen(filename, "rb");
  if (!f)
  {
    LOG_ERROR("Failed to open file '%s': %s\n", filename, strerror(errno));
    return NULL;
  }

  if (fseek(f, 0, SEEK_END) != 0)
  {
    LOG_ERROR("Failed to seek file '%s': %s\n", filename, strerror(errno));
    fclose(f);
    return NULL;
  }

  long len = ftell(f);
  if (len < 0)
  {
    LOG_ERROR("Failed to get file size '%s': %s\n", filename, strerror(errno));
    fclose(f);
    return NULL;
  }

  if (len > MAX_FILE_SIZE)
  {
    LOG_ERROR("File '%s' too large (%ld bytes)\n", filename, len);
    fclose(f);
    return NULL;
  }

  rewind(f);

  char *data = malloc(len + 1);
  if (!data)
  {
    LOG_ERROR("Failed to allocate memory for file '%s'\n", filename);
    fclose(f);
    return NULL;
  }

  size_t read_len = fread(data, 1, len, f);
  if (read_len != (size_t)len)
  {
    LOG_ERROR("Read error in file '%s': expected %ld, got %zu\n", filename, len, read_len);
    free(data);
    fclose(f);
    return NULL;
  }

  data[len] = '\0';
  fclose(f);

  if (out_len)
  {
    *out_len = len;
  }
  return data;
}

char *url_encode(const unsigned char *src, size_t len)
{
  if (!src || len == 0)
    return strdup("");

  char *encoded = malloc(len * 3 + 1);
  if (!encoded)
    return NULL;

  const char hex[] = "0123456789ABCDEF";
  size_t pos = 0;

  for (size_t i = 0; i < len && pos < len * 3; i++)
  {
    unsigned char c = src[i];
    if (isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~')
    {
      encoded[pos++] = c;
    }
    else
    {
      if (pos + 3 > len * 3)
        break;
      encoded[pos++] = '%';
      encoded[pos++] = hex[c >> 4];
      encoded[pos++] = hex[c & 0x0F];
    }
  }
  encoded[pos] = '\0';
  return encoded;
}

int ensure_safe_dir()
{
  if (access(SAFE_DIR, F_OK))
  {
    if (mkdir(SAFE_DIR, 0777) != 0)
    {
      LOG_ERROR("Failed to create directory '%s': %s\n", SAFE_DIR, strerror(errno));
      return 0;
    }
  }
  return 1;
}

char *sanitize_filename(const char *input)
{
  if (!input)
    return NULL;

  char *output = malloc(strlen(input) + 1);
  if (!output)
    return NULL;

  size_t j = 0;
  for (size_t i = 0; input[i]; i++)
  {
    if (isalnum(input[i]) || input[i] == '.' || input[i] == '_' || input[i] == '-')
    {
      output[j++] = input[i];
    }
  }
  output[j] = '\0';
  return output;
}

void write_formatted_code(FILE *file, const char *code)
{
  while (*code)
  {
    if (*code == '\\' && *(code + 1) == 'n')
    {
      fputc('\n', file);
      code++;
    }
    else if (*code == '\\' && *(code + 1) == '"')
    {
      fputc('"', file);
      code++;
    }
    else if (*code == '\\' && *(code + 1) == 't')
    {
      fputc(' ', file);
      code++;
    }
    else
    {
      fputc(*code, file);
    }
    code++;
  }
}

static void *compile_gooey_code(void *path)
{
  char command[1024];
  system("cp ./robotto.ttf ./tmp");

  snprintf(command, sizeof(command),
           "gcc -v %s -o %s -L/usr/local/lib -lfreetype -lGooeyGUI "
           "-I/usr/local/include/Gooey/ -I/usr/local/include/GLPS/  -lGLPS  "
           "-lm && ./%s",
           (char *)path, "executable", "executable");

  printf("%s \n", command);
  system(command);
  free(path);
  return NULL;
}

static void run_command(const char *id, const char *req, void *arg)
{
  if (!req || strlen(req) < 3)
  {
    LOG_ERROR("Invalid request\n");
    return;
  }

  char *code = strdup(req + 2);
  if (!code)
  {
    LOG_ERROR("Memory allocation failed\n");
    return;
  }

  size_t len = strlen(code);
  if (len >= 2)
    code[len - 2] = '\0';

  if (!ensure_safe_dir())
  {
    free(code);
    return;
  }

  char *safe_filename = sanitize_filename("source.c");
  if (!safe_filename)
  {
    free(code);
    return;
  }

  char *full_path = malloc(PATH_MAX);
  if (!full_path)
  {
    LOG_ERROR("Memory allocation failed\n");
    free(safe_filename);
    free(code);
    return;
  }

  snprintf(full_path, PATH_MAX, "./%s/%s", SAFE_DIR, safe_filename);
  free(safe_filename);

  FILE *f = fopen(full_path, "w");
  if (!f)
  {
    LOG_ERROR("Failed to open file '%s': %s\n", full_path, strerror(errno));
    free(code);
    free(full_path);
    return;
  }

  write_formatted_code(f, code);
  fclose(f);
  free(code);

  // Start thread with heap-allocated file path
  gthread_t thread;
  glps_thread_create(&thread, NULL, compile_gooey_code, full_path);
  glps_thread_detach(thread);
}

void docs_command()
{
  system("x-www-browser https://gooeyui.github.io/GooeyGUI/website/docs");
}

char *combine_resources()
{
  const char *resources[] = {
      "styles.css", "codemirror.min.css", "show-hint.min.css", "index.html",
      "codemirror.min.js", "show-hint.min.js", "clike.min.js", "app.js", NULL};

  char *contents[8] = {NULL};
  size_t total_size = 1024;

  for (int i = 0; resources[i]; i++)
  {
    contents[i] = read_file(resources[i], NULL);
    if (!contents[i])
    {
      LOG_ERROR("Failed to load resource: %s\n", resources[i]);
      goto cleanup;
    }
    total_size += strlen(contents[i]);
  }

  char *full_html = malloc(total_size);
  if (!full_html)
  {
    LOG_ERROR("Failed to allocate memory for HTML\n");
    goto cleanup;
  }

  snprintf(full_html, total_size,
           "<!DOCTYPE html><html><head><meta charset='UTF-8'>"
           "<title>Gooey Builder</title>"
           "<style>%s%s%s</style>"
           "</head><body>%s"
           "<script>%s%s%s%s</script>"
           "</body></html>",
           contents[0], contents[1], contents[2], contents[3],
           contents[4], contents[5], contents[6], contents[7]);

cleanup:
  for (int i = 0; resources[i]; i++)
  {
    if (contents[i])
      free(contents[i]);
  }

  return full_html;
}

void destroy_splash(void *splash_win)
{
  GooeyWindow_Cleanup(1, splash_win);
}

int main()
{

  /*
    You might be wondering, why I've decided to fork here.
    Well since i'm using Gooey for Splash and GTK for webview (hopefully we'll implement our own in Gooey)
    I have to fork so when cleanup for gooey happens it doesn't interfere with GTK.
  */

  pid_t n = fork();

  if (n == 0)
  {
    Gooey_Init();
    // Splash with GOOEY
    GooeyWindow *splash_win = GooeyWindow_Create("Welcome", 736 / 2, 1104 / 2, true);
    GooeyWindow_MakeResizable(splash_win, false);
    GooeyWindow_ToggleDecorations(splash_win, false);

    GooeyImage *splash_bg =
        GooeyImage_Create("splashscreen.png", 0, 0, 736 / 2, 1104 / 2, NULL);

    GooeyTimer *timer = GooeyTimer_Create();
    GooeyTimer_SetCallback(3000, timer, destroy_splash, splash_win);
    
    
    GooeyWindow_RegisterWidget(splash_win, splash_bg);
    GooeyWindow_EnableDebugOverlay(splash_win, false);
    
    GooeyWindow_Run(1, splash_win);
    GooeyTimer_Destroy(timer);
    exit(EXIT_SUCCESS);
  }
  else
  {
    int status;
    wait(&status);
    if (!ensure_safe_dir())
      return 1;

    char *full_html = combine_resources();
    if (!full_html)
    {
      LOG_ERROR("Failed to build HTML document\n");
      return 1;
    }

    char *encoded = url_encode((unsigned char *)full_html, strlen(full_html));
    free(full_html);
    if (!encoded)
    {
      LOG_ERROR("Failed to encode HTML\n");
      return 1;
    }

    char *data_uri = malloc(strlen(encoded) + 50);
    if (!data_uri)
    {
      free(encoded);
      return 1;
    }
    snprintf(data_uri, strlen(encoded) + 50, "data:text/html;charset=UTF-8,%s", encoded);
    free(encoded);

    webview_t w = webview_create(1, NULL);
    if (!w)
    {
      free(data_uri);
      LOG_ERROR("Failed to create webview\n");
      return 1;
    }

    webview_set_title(w, "Gooey Builder");
    webview_set_size(w, 1024, 768, WEBVIEW_HINT_NONE);
    webview_bind(w, "_runCommand", run_command, NULL);
    webview_bind(w, "_docsCommand", docs_command, NULL);

    printf("Loading application...\n");
    webview_navigate(w, data_uri);
    free(data_uri);

    webview_run(w);
    webview_destroy(w);
    exit(EXIT_SUCCESS);
  }
  return 0;
}
