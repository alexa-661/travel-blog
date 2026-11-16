#ifndef IMAGE_H
#define IMAGE_H

#include <memory>
#include <vector>
#include "../third_party/stb/stb_image.h"

struct Image
{
    int width;
    int height;
    int channels;

    // Alexa: rbg values are unsigned, up to one byte of memory per pixel. 
    std::vector<unsigned char> pixels;

    //Alexa: std::move prevents allocating more memory, which is important for large photos. 
    Image (int w, int h, int c, std::vector<unsigned char> pixels) : width(w), height(h), channels(c), pixels(std::move(pixels))
    {}
};

#endif // IMAGE_H