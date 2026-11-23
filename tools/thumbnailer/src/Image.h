#ifndef IMAGE_H
#define IMAGE_H

#include <memory>
#include <vector>

struct Image
{
    enum class ChannelOptions
    {
        Gray = 1,
        RGB = 3,
        RGBA = 4
    };

    int width;
    int height;
    ChannelOptions channels;

    // Alexa: rbg values are unsigned, up to one byte of memory per pixel. 
    std::vector<unsigned char> pixels;

    Image()
    {
        width = 0;
        height = 0;
        channels = ChannelOptions::RGB; 
        pixels = {};
    }

    //Alexa: std::move prevents allocating more memory, which is important for large photos. 
    Image (int w, int h, ChannelOptions c, std::vector<unsigned char> pixels) : width(w), height(h), channels(c), pixels(std::move(pixels))
    {}
};

#endif // IMAGE_H