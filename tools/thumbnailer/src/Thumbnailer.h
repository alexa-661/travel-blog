#ifndef THUMBNAILER_H
#define THUMBNAILER_H

#include <filesystem>

class Thumbnailer
{
public:
   bool create(const std::filesystem::path& inputPath, const std::filesystem::path& outputPath);
};

#endif // THUMBNAILER_H