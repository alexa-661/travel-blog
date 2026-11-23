#include "FileValidator.h"
#include <iostream>

bool FileValidator::validate(const std::filesystem::path& inputPath, const std::filesystem::path& outputPath)
{

   std::error_code error;
   if (!std::filesystem::is_regular_file(inputPath, error))
   {
      std::cerr << "Input is not a file: " << inputPath << "\n";
      return false;
   }

   const auto canonicalInput = std::filesystem::weakly_canonical(inputPath, error);
   if (error)
   {
      std::cerr << "Could not resolve input path: " << error.message() << "\n";
      return false;
   }

   const auto canonicalOutput = std::filesystem::weakly_canonical(outputPath, error);
   if (error)
   {
      std::cerr << "Could not resolve output path: " << error.message() << "\n";
      return false;
   }

   if (canonicalInput == canonicalOutput)
   {
      std::cerr << "Input and output must be different files.\n";
      return false;
   }

   const auto outputDirectory = outputPath.parent_path();
   if (!outputDirectory.empty() &&
       !std::filesystem::is_directory(outputDirectory, error))
   {
      std::cerr << "Output directory does not exist: " << outputDirectory << "\n";
      return false;
   }

   return true;
}