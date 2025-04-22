#include <Gooey/gooey.h>

int main()
{
    Gooey_Init();
    GooeyWindow *win = GooeyWindow_Create("My Window", 800, 600, true);

    GooeyWindow_MakeVisible(win, false);
    GooeyWindow_MakeResizable(win, false);
    GooeyButton *button_0 = GooeyButton_Create("Button", 61, 73, 100, 30, NULL);
    GooeyImage *image_1 = GooeyImage_Create("./assets/example.png", 403, 166, 150, 150, NULL);
    GooeySlider *slider_2 = GooeySlider_Create(358, 68, 150, 0, 100, false, NULL);
    GooeyLabel *label_3 = GooeyLabel_Create("Label", 0.26f, 59, 27);
    GooeyCheckbox *checkbox_4 = GooeyCheckbox_Create(10, 10, "", NULL);
    GooeyTextbox *input_5 = GooeyTextBox_Create(186, 281, 150, 24, "", NULL);
    GooeyDropSurface *dropsurface_6 = GooeyDropSurface_Create(22, 137, 200, 150, "Drop files here..", NULL);

    GooeyWindow_RegisterWidget(win, button_0);
    GooeyWindow_RegisterWidget(win, image_1);
    GooeyWindow_RegisterWidget(win, slider_2);
    GooeyWindow_RegisterWidget(win, label_3);
    GooeyWindow_RegisterWidget(win, checkbox_4);
    GooeyWindow_RegisterWidget(win, input_5);
    GooeyWindow_RegisterWidget(win, dropsurface_6);

    GooeyWindow_Run(1, win);
    GooeyWindow_Cleanup(1, win);

    return 0;
}
