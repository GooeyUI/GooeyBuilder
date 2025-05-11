#include <Gooey/gooey.h>

int main()
{
    Gooey_Init();
    GooeyWindow *win = GooeyWindow_Create("My Window", 800, 600, true);

    GooeyWindow_MakeVisible(win, false);
    GooeyWindow_MakeResizable(win, false);
    GooeyButton *button_0 = GooeyButton_Create("Button", 276, 103, 100, 30, NULL);

    GooeyWindow_RegisterWidget(win, button_0);

    GooeyWindow_Run(1, win);
    GooeyWindow_Cleanup(1, win);

    return 0;
}
