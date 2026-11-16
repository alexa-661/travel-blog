#ifndef IMAGE_RESIZER_H
#define IMAGE_RESIZER_H

#include "Image.h"

class ImageResizer
{
   public:
      static bool resize(const Image& inputImage, Image& outputImage);
};

#endif // IMAGE_RESIZER_H