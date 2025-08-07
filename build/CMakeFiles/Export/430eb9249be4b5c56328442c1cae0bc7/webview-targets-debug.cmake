#----------------------------------------------------------------
# Generated CMake target import file for configuration "Debug".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "webview::core_shared" for configuration "Debug"
set_property(TARGET webview::core_shared APPEND PROPERTY IMPORTED_CONFIGURATIONS DEBUG)
set_target_properties(webview::core_shared PROPERTIES
  IMPORTED_LOCATION_DEBUG "${_IMPORT_PREFIX}/lib/libwebviewd.so.0.12.0"
  IMPORTED_SONAME_DEBUG "libwebviewd.so.0.12"
  )

list(APPEND _cmake_import_check_targets webview::core_shared )
list(APPEND _cmake_import_check_files_for_webview::core_shared "${_IMPORT_PREFIX}/lib/libwebviewd.so.0.12.0" )

# Import target "webview::core_static" for configuration "Debug"
set_property(TARGET webview::core_static APPEND PROPERTY IMPORTED_CONFIGURATIONS DEBUG)
set_target_properties(webview::core_static PROPERTIES
  IMPORTED_LINK_INTERFACE_LANGUAGES_DEBUG "CXX"
  IMPORTED_LOCATION_DEBUG "${_IMPORT_PREFIX}/lib/libwebviewd.a"
  )

list(APPEND _cmake_import_check_targets webview::core_static )
list(APPEND _cmake_import_check_files_for_webview::core_static "${_IMPORT_PREFIX}/lib/libwebviewd.a" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
