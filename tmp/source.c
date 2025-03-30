#include <Gooey/gooey.h>

int main()
{
    Gooey_Init();
    GooeyWindow *win = GooeyWindow_Create("My Window", 800, 600, true);

    GooeyButton *button_0 = GooeyButton_Create("hello world!", 92, 55, 100, 30, NULL);
    GooeySlider *slider_1 = GooeySlider_Create(64, 104, 150, 0, 100, false, NULL);
    GooeyTextbox *input_2 = GooeyTextBox_Create(73, 185, 150, 24, "test", NULL);
    GooeyDropSurface *dropsurface_3 = GooeyDropSurface_Create(52, 280, 200, 150, "Drop files here..", NULL);

    GooeyWindow_RegisterWidget(win, button_0);
    GooeyWindow_RegisterWidget(win, slider_1);
    GooeyWindow_RegisterWidget(win, input_2);
    GooeyWindow_RegisterWidget(win, dropsurface_3);

    GooeyWindow_Run(1, win);
    GooeyWindow_Cleanup(1, win);

    return 0;
}
