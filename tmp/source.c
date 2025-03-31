#include <Gooey/gooey.h>

int main()
{
    Gooey_Init();
    GooeyWindow *win = GooeyWindow_Create("My Window", 800, 600, true);

    const char* options_dropdown_0[3] = {"test","test1","test2"};
    GooeyDropdown *dropdown_0 = GooeyDropdown_Create(205, 288, 100, 30, options_dropdown_0, 3, NULL);

    GooeyWindow_RegisterWidget(win, dropdown_0);

    GooeyWindow_Run(1, win);
    GooeyWindow_Cleanup(1, win);

    return 0;
}
