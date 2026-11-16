#include "ImageLoader.h"
#include <iostream>
#include <vector>

std::optional<Image> ImageLoader::load(const std::filesystem::path& path)
{
   int width = 0;
   int height = 0;
   int channels = 0;

   unsigned char* rawPixels = stbi_load(
      path.string().c_str(),
      &width,
      &height,
      &channels,
      3
   );


   if (!rawPixels)
   {
      const char* reason = stbi_failure_reason();

      std::cerr
         << "Could not decode image: "
         << (reason ? reason : "unknown error")
         << "\n";

      return std::nullopt;
   }

   std::vector<unsigned char> pixels(
        rawPixels,
        rawPixels + (width * height * 3)
    );

   stbi_image_free(rawPixels); //Alexa: manually free up the memory!


    return Image(
      width,
      height,
      3,
      pixels
   );
}