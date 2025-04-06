#include <Gooey/gooey.h>

int main()
{
    Gooey_Init();
    GooeyWindow *win = GooeyWindow_Create("My Window", 800, 600, true);

    GooeyWindow_SetContinuousRedraw(win);
    GooeyWindow_MakeVisible(win, false);
    GooeyWindow_MakeResizable(win, false);
    GooeyButton *button_0 = GooeyButton_Create("Button", 186, 28, 100, 30, NULL);
    GooeyList *list_1 = GooeyList_Create(37, 160, 200, 200, NULL);
    GooeyList_AddItem(list_1, "test", "");
    GooeyList_AddItem(list_1, "test2", "");
    GooeyList_AddItem(list_1, "1", "");
    GooeyList_AddItem(list_1, "1", "");
    GooeyList_AddItem(list_1, "1", "");
    GooeyList_AddItem(list_1, "1", "");
    GooeyList_AddItem(list_1, "1", "");
    GooeyList_AddItem(list_1, "1", "");
    GooeyList_AddItem(list_1, "1", "");
    GooeyList_AddItem(list_1, "1", "");
    GooeyList_AddItem(list_1, "1", "");

    GooeyWindow_RegisterWidget(win, button_0);
    GooeyWindow_RegisterWidget(win, list_1);

    GooeyWindow_Run(1, win);
    GooeyWindow_Cleanup(1, win);

    return 0;
}
