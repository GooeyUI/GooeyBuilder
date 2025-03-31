#include <Gooey/gooey.h>

int main()
{
    Gooey_Init();
    GooeyWindow *win = GooeyWindow_Create("My Window", 800, 600, true);

    GooeyButton *button_0 = GooeyButton_Create("Button", 38, 85, 100, 30, NULL);
    GooeyLabel *label_1 = GooeyLabel_Create("Label", 0.26f, 91, 51);

    GooeyWindow_RegisterWidget(win, button_0);
    GooeyWindow_RegisterWidget(win, label_1);

    GooeyWindow_Run(1, win);
    GooeyWindow_Cleanup(1, win);

    return 0;
}
