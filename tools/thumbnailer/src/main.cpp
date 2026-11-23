
#include <filesystem>
#include <iostream>
#include "Thumbnailer.h"

int main(int argc, char* argv[])
{
   if (argc != 3)
   {
      std::cerr << "Usage: thumbnailer <input> <output>\n";
      return 1;
   }

   const std::filesystem::path inputPath(argv[1]);
   const std::filesystem::path outputPath(argv[2]);

   Thumbnailer thumbnailer;
   if (!thumbnailer.create(inputPath, outputPath))
   {
      return 1;
   }

    std::cout << "Thumbnail created successfully\n";

    return 0;
}