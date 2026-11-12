#include <filesystem>
#include <fstream>
#include <iostream>
#include <system_error>

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
      std::cerr << "Input is not a readable file: " << inputPath << "\n";
      return 1;
   }

   std::ifstream input(inputPath, std::ios::binary);
   if (!input)
   {
      std::cerr << "Could not open input file: " << inputPath << "\n";
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

   if (!std::filesystem::is_directory(outputDirectory, error))
   {
      std::cerr << "Output directory does not exist: " << outputDirectory << "\n";
      return 1;
   }

   std::cout << "Input: " << inputPath << "\n";
   std::cout << "Output: " << outputPath << "\n";
   return 0;
}