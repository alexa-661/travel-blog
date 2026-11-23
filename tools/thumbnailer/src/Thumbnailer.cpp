#include "Thumbnailer.h"
#include <vector>
#include "ImageLoader.h"
#include "ImageResizer.h"
#include "FileValidator.h"
#include "Image.h"
#include <iostream>

#include "../third_party/stb/stb_image_write.h"

bool Thumbnailer::create(const std::filesystem::path& inputPath, const std::filesystem::path& outputPath)
{
   if (!FileValidator::validate(inputPath, outputPath))
   {
      std::cerr << "The input or output path could not be validated.\n";
   }

   const std::string outputFilename = outputPath.string();

   ImageLoader loader;

   auto inputImage = loader.load(inputPath);

   if (!inputImage)
   {
      std::cerr << "Could not load image: " << inputPath << "\n";
      return false;

   }

   std::cout << inputImage->width << "x" << inputImage->height << "\n";

   Image outputImage = Image();

   if (!ImageResizer::resize(*inputImage, outputImage))
   {
      std::cerr << "Could not resize image: " << inputPath << "\n";
      return false;
   }

   std::cout << "Resized to " << outputImage.width << "x" << outputImage.height << "\n";

   if (!stbi_write_jpg(
          outputFilename.c_str(),
          outputImage.width,
          outputImage.height,
          static_cast<int>(Image::ChannelOptions::RGB),
          outputImage.pixels.data(),
          100))
   {
      std::cerr << "Could not write output image: " << outputPath << "\n";
      return false;
   }

   std::cout << "Created " << outputPath << " ("
             << outputImage.width << "x" << outputImage.height << ")\n";
   return true;
}
