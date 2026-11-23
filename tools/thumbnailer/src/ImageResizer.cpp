#include "ImageResizer.h"

#include <algorithm>
#include <iostream>
#include <vector>
#include <cmath>

#include "../third_party/stb/stb_image_resize2.h"

const double MAX_WIDTH_PX = 320.0;
const double MAX_HEIGHT_PX = 320.0;

bool ImageResizer::resize(const Image& inputImage, Image& outputImage)
{
   const double scale = std::min({
      1.0,
      MAX_WIDTH_PX / inputImage.width,
      MAX_HEIGHT_PX / inputImage.height
   });

   const int outputWidth = std::round(std::max(
      1, static_cast<int>(inputImage.width * scale + 0.5)));
   const int outputHeight = std::round(std::max(
      1, static_cast<int>(inputImage.height * scale + 0.5)));

   std::vector<unsigned char> resizedPixels(static_cast<std::size_t>(outputWidth) * outputHeight * 3);

   if (!stbir_resize_uint8_srgb(
         inputImage.pixels.data(),
         inputImage.width,
         inputImage.height,
         0,
         resizedPixels.data(),
         outputWidth,
         outputHeight,
         0,
         STBIR_RGB))
   {
      std::cerr << "Could not resize image.\n";
      return false;
   }

   outputImage.width = outputWidth;
   outputImage.height = outputHeight;
   outputImage.channels = Image::ChannelOptions::RGB;
   outputImage.pixels = std::move(resizedPixels);
   return true;
}