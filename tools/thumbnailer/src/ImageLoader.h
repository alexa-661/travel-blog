#ifndef IMAGE_LOADER_H
#define IMAGE_LOADER_H

#include <filesystem>
#include <optional>

#include "Image.h"


class ImageLoader
{
   public:
      std::optional<Image> load(const std::filesystem::path& path);
};

#endif // IMAGE_LOADER_H