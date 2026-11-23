#ifndef FILE_VALIDATOR_H
#define FILE_VALIDATOR_H

#include <filesystem>

class FileValidator
{
   public:
      static bool validate(const std::filesystem::path& inputPath, const std::filesystem::path& outputPath);
};

#endif // FILE_VALIDATOR_H