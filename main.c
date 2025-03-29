#include "webview/webview.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

char *read_file(const char *filename, size_t *out_len) {
    FILE *f = fopen(filename, "rb");
    if (!f) {
        fprintf(stderr, "Failed to open file: %s\n", filename);
        return NULL;
    }

    fseek(f, 0, SEEK_END);
    long len = ftell(f);
    fseek(f, 0, SEEK_SET);

    char *data = malloc(len + 1);
    if (!data) {
        fclose(f);
        return NULL;
    }

    size_t read_len = fread(data, 1, len, f);
    if (read_len != (size_t)len) {
        fprintf(stderr, "Read error in file: %s\n", filename);
        free(data);
        fclose(f);
        return NULL;
    }
    data[len] = '\0';
    fclose(f);
    
    if (out_len) *out_len = len;
    return data;
}

char *url_encode(const unsigned char *src, size_t len) {
    const char hex[] = "0123456789ABCDEF";
    char *encoded = malloc(len * 3 + 1);
    size_t pos = 0;

    for (size_t i = 0; i < len; i++) {
        unsigned char c = src[i];
        if (isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~') {
            encoded[pos++] = c;
        } else {
            encoded[pos++] = '%';
            encoded[pos++] = hex[c >> 4];
            encoded[pos++] = hex[c & 0x0F];
        }
    }
    encoded[pos] = '\0';
    return encoded;
}

char *combine_resources() {
    size_t len;
    
    char *cm_css = read_file("codemirror.min.css", &len);
    char *showhint_css = read_file("show-hint.min.css", &len);
    char *styles = read_file("styles.css", &len);

    char *cm_js = read_file("codemirror.min.js", &len);
    char *showhint_js = read_file("show-hint.min.js", &len);
    char *clike_js = read_file("clike.min.js", &len);
    char *app_js = read_file("app.js", &len);
    
    char *html = read_file("index.html", &len);
    if (!html) {
        fprintf(stderr, "Failed to load index.html\n");
        return NULL;
    }

    size_t total_size = 1024; // Base HTML structure
    total_size += cm_css ? strlen(cm_css) : 0;
    total_size += showhint_css ? strlen(showhint_css) : 0;
    total_size += styles ? strlen(styles) : 0;
    total_size += cm_js ? strlen(cm_js) : 0;
    total_size += showhint_js ? strlen(showhint_js) : 0;
    total_size += clike_js ? strlen(clike_js) : 0;
    total_size += app_js ? strlen(app_js) : 0;
    total_size += strlen(html);

    // Build the complete HTML
    char *full_html = malloc(total_size);
    if (!full_html) return NULL;

    snprintf(full_html, total_size,
        "<!DOCTYPE html><html><head><meta charset='UTF-8'>"
        "<style>%s%s%s</style>" 
        "</head><body>%s"       
        "<script>%s%s%s%s</script>" 
        "</body></html>",
        cm_css ? cm_css : "",
        showhint_css ? showhint_css : "",
        styles ? styles : "",
        html ? html : "",
        cm_js ? cm_js : "",
        showhint_js ? showhint_js : "",
        clike_js ? clike_js : "",
        app_js ? app_js : "");

    if (cm_css) free(cm_css);
    if (showhint_css) free(showhint_css);
    if (styles) free(styles);
    if (cm_js) free(cm_js);
    if (showhint_js) free(showhint_js);
    if (clike_js) free(clike_js);
    if (app_js) free(app_js);
    if (html) free(html);

    return full_html;
}

int main() {
    char *full_html = combine_resources();
    if (!full_html) {
        fprintf(stderr, "Failed to build HTML document\n");
        return 1;
    }

    char *encoded = url_encode((unsigned char *)full_html, strlen(full_html));
    free(full_html);
    if (!encoded) {
        fprintf(stderr, "Failed to encode HTML\n");
        return 1;
    }

    char *data_uri = malloc(strlen(encoded) + 20);
    if (!data_uri) {
        free(encoded);
        return 1;
    }
    sprintf(data_uri, "data:text/html;charset=UTF-8,%s", encoded);
    free(encoded);

 
    webview_t w = webview_create(1, NULL);  
    if (!w) {
        free(data_uri);
        fprintf(stderr, "Failed to create webview\n");
        return 1;
    }

    webview_set_title(w, "Gooey Builder");
    webview_set_size(w, 1024, 768, WEBVIEW_HINT_NONE);
    
    printf("Loading application...\n");
    webview_navigate(w, data_uri);
    free(data_uri);

    webview_run(w);
    webview_destroy(w);
    return 0;
}