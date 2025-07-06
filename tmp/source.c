#include <gooey.h>
#include <Arduino.h>

void setup()
{
    Gooey_Init();
    GooeyWindow *win = GooeyWindow_Create("My Window", 480, 320, true);

    GooeyWindow_MakeVisible(win, false);
    GooeyWindow_MakeResizable(win, false);
    GooeyButton *button_0 = GooeyButton_Create("test", 14, 12, 100, 30, NULL);
    GooeySlider *slider_1 = GooeySlider_Create(56, 120, 150, 50, 100, false, NULL);

    GooeyWindow_RegisterWidget(win, button_0);
    GooeyWindow_RegisterWidget(win, slider_1);

    GooeyWindow_Run(1, win);
}
void loop(){}