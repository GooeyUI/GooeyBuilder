#include <Gooey/gooey.h>

int main()
{
    Gooey_Init();
    GooeyWindow *win = GooeyWindow_Create("My Window", 800, 600, true);

    GooeyWindow_SetContinuousRedraw(win);
    GooeyWindow_MakeVisible(win, false);
    GooeyWindow_MakeResizable(win, false);
    GooeyLabel *label_0 = GooeyLabel_Create("Label", 0.26f, 265, 53);
    GooeySlider *slider_1 = GooeySlider_Create(250, 167, 150, 0, 100, true, NULL);

    GooeyWindow_RegisterWidget(win, label_0);
    GooeyWindow_RegisterWidget(win, slider_1);

    GooeyWindow_Run(1, win);
    GooeyWindow_Cleanup(1, win);

    return 0;
}
