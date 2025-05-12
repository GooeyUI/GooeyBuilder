#include <Gooey/gooey.h>

void hello_world_btn() {
    system("zenity --info --text='Hello world dhiee'");
}

int main()
{
    Gooey_Init();
    GooeyWindow *win = GooeyWindow_Create("My Window", 800, 600, true);

    GooeyWindow_MakeVisible(win, false);
    GooeyWindow_MakeResizable(win, false);
    GooeyButton *button_0 = GooeyButton_Create("test", 135, 68, 144, 30, hello_world_btn);
    GooeyList *list_1 = GooeyList_Create(256, 162, 200, 200, NULL);
    GooeyCanvas *canvas_2 = GooeyCanvas_Create(59, 221, 200, 150);

    GooeyWindow_RegisterWidget(win, button_0);
    GooeyWindow_RegisterWidget(win, list_1);
    GooeyWindow_RegisterWidget(win, canvas_2);

    GooeyWindow_Run(1, win);
    GooeyWindow_Cleanup(1, win);

    return 0;
}
