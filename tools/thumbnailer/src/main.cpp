#include <algorithm>
#include <filesystem>
#include <iostream>
#include <memory>
#include <string>
#include <system_error>
#include <vector>
#include "ImageLoader.h"
#include "ImageResizer.h"

#include "../third_party/stb/stb_image_write.h"

int main(int argc, char* argv[])
{
   if (argc != 3)
   {
      std::cerr << "Usage: thumbnailer <input> <output>\n";
      return 1;
   }

   const std::filesystem::path inputPath(argv[1]);
   const std::filesystem::path outputPath(argv[2]);

   std::error_code error;
   if (!std::filesystem::is_regular_file(inputPath, error))
   {
      std::cerr << "Input is not a file: " << inputPath << "\n";
      return 1;
   }

   const auto canonicalInput = std::filesystem::weakly_canonical(inputPath, error);
   if (error)
   {
      std::cerr << "Could not resolve input path: " << error.message() << "\n";
      return 1;
   }

   const auto canonicalOutput = std::filesystem::weakly_canonical(outputPath, error);
   if (error)
   {
      std::cerr << "Could not resolve output path: " << error.message() << "\n";
      return 1;
   }

   if (canonicalInput == canonicalOutput)
   {
      std::cerr << "Input and output must be different files.\n";
      return 1;
   }

   const auto outputDirectory = outputPath.parent_path();
   if (!outputDirectory.empty() &&
       !std::filesystem::is_directory(outputDirectory, error))
   {
      std::cerr << "Output directory does not exist: " << outputDirectory << "\n";
      return 1;
   }

   const std::string inputFilename = inputPath.string();
   const std::string outputFilename = outputPath.string();

   ImageLoader loader;

   auto inputImage = loader.load(inputPath);

   if (!inputImage)
   {
      std::cerr << "Could not load image: " << inputPath << "\n";
      return 1;

   }

   std::cout << inputImage->width << "x" << inputImage->height << "\n";

   Image outputImage = Image(0, 0, 3, {});

   if (!ImageResizer::resize(*inputImage, outputImage))
   {
      std::cerr << "Could not resize image: " << inputPath << "\n";
      return 1;
   }

   std::cout << "Resized to " << outputImage.width << "x" << outputImage.height << "\n";

   if (!stbi_write_jpg(
          outputFilename.c_str(),
          outputImage.width,
          outputImage.height,
          3,
          outputImage.pixels.data(),
          100))
   {
      std::cerr << "Could not write output image: " << outputPath << "\n";
      return 1;
   }

   std::cout << "Created " << outputPath << " ("
             << outputImage.width << "x" << outputImage.height << ")\n";
   return 0;
}