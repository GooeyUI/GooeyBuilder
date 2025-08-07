# Install script for directory: /home/yassine-ahmed-ali/Documents/GooeyBuilder/third_party/webview

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/usr/local")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Debug")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Install shared libraries without execute permission?
if(NOT DEFINED CMAKE_INSTALL_SO_NO_EXE)
  set(CMAKE_INSTALL_SO_NO_EXE "1")
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

# Set default install directory permissions.
if(NOT DEFINED CMAKE_OBJDUMP)
  set(CMAKE_OBJDUMP "/usr/bin/objdump")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/compatibility/cmake_install.cmake")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/test_driver/cmake_install.cmake")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/core/cmake_install.cmake")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/examples/cmake_install.cmake")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/docs/cmake_install.cmake")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "webview_headers" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include" TYPE DIRECTORY FILES "/home/yassine-ahmed-ali/Documents/GooeyBuilder/third_party/webview/cmake/../core/include/webview")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "webview_cmake" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/webview" TYPE DIRECTORY FILES "/home/yassine-ahmed-ali/Documents/GooeyBuilder/third_party/webview/cmake/modules")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "webview_libraries_runtime_release" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    foreach(file
        "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libwebviewd.so.0.12.0"
        "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libwebviewd.so.0.12"
        )
      if(EXISTS "${file}" AND
         NOT IS_SYMLINK "${file}")
        file(RPATH_CHECK
             FILE "${file}"
             RPATH "\$ORIGIN:\$ORIGIN/../lib")
      endif()
    endforeach()
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE SHARED_LIBRARY FILES
      "/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/core/libwebviewd.so.0.12.0"
      "/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/core/libwebviewd.so.0.12"
      )
    foreach(file
        "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libwebviewd.so.0.12.0"
        "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libwebviewd.so.0.12"
        )
      if(EXISTS "${file}" AND
         NOT IS_SYMLINK "${file}")
        file(RPATH_CHANGE
             FILE "${file}"
             OLD_RPATH "::::::::::::::::::::::"
             NEW_RPATH "\$ORIGIN:\$ORIGIN/../lib")
        if(CMAKE_INSTALL_DO_STRIP)
          execute_process(COMMAND "/usr/bin/strip" "${file}")
        endif()
      endif()
    endforeach()
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "webview_trash" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE SHARED_LIBRARY FILES "/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/core/libwebviewd.so")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "webview_trash" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/core/libwebviewd.a")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "webview_libraries" OR NOT CMAKE_INSTALL_COMPONENT)
  foreach(file
      "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libwebviewd.so.0.12.0"
      "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libwebviewd.so.0.12"
      )
    if(EXISTS "${file}" AND
       NOT IS_SYMLINK "${file}")
      file(RPATH_CHECK
           FILE "${file}"
           RPATH "\$ORIGIN:\$ORIGIN/../lib")
    endif()
  endforeach()
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE SHARED_LIBRARY FILES
    "/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/core/libwebviewd.so.0.12.0"
    "/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/core/libwebviewd.so.0.12"
    )
  foreach(file
      "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libwebviewd.so.0.12.0"
      "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libwebviewd.so.0.12"
      )
    if(EXISTS "${file}" AND
       NOT IS_SYMLINK "${file}")
      file(RPATH_CHANGE
           FILE "${file}"
           OLD_RPATH "::::::::::::::::::::::"
           NEW_RPATH "\$ORIGIN:\$ORIGIN/../lib")
      if(CMAKE_INSTALL_DO_STRIP)
        execute_process(COMMAND "/usr/bin/strip" "${file}")
      endif()
    endif()
  endforeach()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "webview_libraries" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE SHARED_LIBRARY FILES "/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/core/libwebviewd.so")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "webview_libraries" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/core/libwebviewd.a")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "webview_cmake" OR NOT CMAKE_INSTALL_COMPONENT)
  if(EXISTS "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/webview/webview-targets.cmake")
    file(DIFFERENT _cmake_export_file_changed FILES
         "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/webview/webview-targets.cmake"
         "/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/CMakeFiles/Export/430eb9249be4b5c56328442c1cae0bc7/webview-targets.cmake")
    if(_cmake_export_file_changed)
      file(GLOB _cmake_old_config_files "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/webview/webview-targets-*.cmake")
      if(_cmake_old_config_files)
        string(REPLACE ";" ", " _cmake_old_config_files_text "${_cmake_old_config_files}")
        message(STATUS "Old export file \"$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/webview/webview-targets.cmake\" will be replaced.  Removing files [${_cmake_old_config_files_text}].")
        unset(_cmake_old_config_files_text)
        file(REMOVE ${_cmake_old_config_files})
      endif()
      unset(_cmake_old_config_files)
    endif()
    unset(_cmake_export_file_changed)
  endif()
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/webview" TYPE FILE FILES "/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/CMakeFiles/Export/430eb9249be4b5c56328442c1cae0bc7/webview-targets.cmake")
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/webview" TYPE FILE FILES "/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/CMakeFiles/Export/430eb9249be4b5c56328442c1cae0bc7/webview-targets-debug.cmake")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "webview_cmake" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/webview" TYPE FILE FILES
    "/home/yassine-ahmed-ali/Documents/GooeyBuilder/third_party/webview/cmake/webview.cmake"
    "/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/webview-config.cmake"
    "/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/webview-config-version.cmake"
    )
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/packaging/cmake_install.cmake")
endif()

if(CMAKE_INSTALL_COMPONENT)
  set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INSTALL_COMPONENT}.txt")
else()
  set(CMAKE_INSTALL_MANIFEST "install_manifest.txt")
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
file(WRITE "/home/yassine-ahmed-ali/Documents/GooeyBuilder/build/${CMAKE_INSTALL_MANIFEST}"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
