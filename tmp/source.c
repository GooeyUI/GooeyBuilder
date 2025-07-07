#include <Gooey/gooey.h>
int main()
{
    Gooey_Init();
    GooeyWindow *win = GooeyWindow_Create("My Window", 480, 320, true);

    GooeyWindow_MakeVisible(win, true);
    GooeyWindow_MakeResizable(win, true);
    GooeyButton *button_0 = GooeyButton_Create("Button", 292, 159, 100, 30, NULL);
    GooeySlider *slider_1 = GooeySlider_Create(10, 10, 150, 0, 100, false, NULL);

    GooeyWindow_RegisterWidget(win, button_0);
    GooeyWindow_RegisterWidget(win, slider_1);

    GooeyWindow_Run(1, win);
    GooeyWindow_Cleanup(1, win);

    return 0;
}
