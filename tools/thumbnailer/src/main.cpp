#include <algorithm>
#include <filesystem>
#include <iostream>
#include <memory>
#include <string>
#include <system_error>
#include <vector>

#define STB_IMAGE_IMPLEMENTATION
#include "../third_party/stb/stb_image.h"

#define STB_IMAGE_RESIZE_IMPLEMENTATION
#include "../third_party/stb/stb_image_resize2.h"

#define STB_IMAGE_WRITE_IMPLEMENTATION
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

   int inputWidth = 0;
   int inputHeight = 0;
   int sourceChannels = 0;

   std::unique_ptr<stbi_uc, decltype(&stbi_image_free)> inputPixels(
      stbi_load(inputFilename.c_str(), &inputWidth, &inputHeight, &sourceChannels, 3),
      stbi_image_free);

   if (!inputPixels)
   {
      const char* reason = stbi_failure_reason();
      std::cerr << "Could not decode image: "
                << (reason ? reason : "unknown error") << "\n";
      return 1;
   }

   constexpr int maxWidth = 320;
   constexpr int maxHeight = 320;

   const double scale = std::min({
      1.0,
      static_cast<double>(maxWidth) / inputWidth,
      static_cast<double>(maxHeight) / inputHeight
   });

   const int outputWidth = std::max(
      1, static_cast<int>(inputWidth * scale + 0.5));
   const int outputHeight = std::max(
      1, static_cast<int>(inputHeight * scale + 0.5));

   std::vector<unsigned char> outputPixels(
      static_cast<std::size_t>(outputWidth) * outputHeight * 3);

   if (!stbir_resize_uint8_srgb(
          inputPixels.get(),
          inputWidth,
          inputHeight,
          0,
          outputPixels.data(),
          outputWidth,
          outputHeight,
          0,
          STBIR_RGB))
   {
      std::cerr << "Could not resize image.\n";
      return 1;
   }

   if (!stbi_write_jpg(
          outputFilename.c_str(),
          outputWidth,
          outputHeight,
          3,
          outputPixels.data(),
          85))
   {
      std::cerr << "Could not write output image: " << outputPath << "\n";
      return 1;
   }

   std::cout << "Created " << outputPath << " ("
             << outputWidth << "x" << outputHeight << ")\n";
   return 0;
}