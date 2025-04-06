#include <Gooey/gooey.h>

int main()
{
    Gooey_Init();
    GooeyWindow *win = GooeyWindow_Create("My Window", 800, 600, true);

    GooeyWindow_SetContinuousRedraw(win);
    GooeyWindow_MakeVisible(win, true);
    GooeyWindow_MakeResizable(win, true);


    GooeyWindow_Run(1, win);
    GooeyWindow_Cleanup(1, win);

    return 0;
}
