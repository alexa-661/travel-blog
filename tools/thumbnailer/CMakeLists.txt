cmake_minimum_required(VERSION 3.20)

project(thumbnailer LANGUAGES CXX)

add_executable(thumbnailer
    src/main.cpp
    src/ImageLoader.cpp
    src/ImageResizer.cpp
    src/stb_implementation.cpp
)

set_target_properties(thumbnailer PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
)

foreach(config DEBUG RELEASE RELWITHDEBINFO MINSIZEREL)
    set_target_properties(thumbnailer PROPERTIES
        "RUNTIME_OUTPUT_DIRECTORY_${config}" "${CMAKE_BINARY_DIR}/bin"
    )
endforeach()