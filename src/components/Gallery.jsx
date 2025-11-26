import { useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trash2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "../../convex/_generated/api";

export default function Gallery() {
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const savePhoto = useMutation(api.photos.save);
  const photos = useQuery(api.photos.list) || [];
  const deletePhoto = useMutation(api.photos.deletePhoto);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      for (const file of acceptedFiles) {
        // 1. Get upload URL
        const postUrl = await generateUploadUrl();

        // 2. Upload file
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();

        // 3. Save metadata
        await savePhoto({ storageId });
      }
    },
    [generateUploadUrl, savePhoto]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  // Navigate to previous photo
  const goToPrevious = useCallback(() => {
    if (!selectedPhoto || photos.length === 0) return;
    const currentIndex = photos.findIndex((p) => p._id === selectedPhoto._id);
    const previousIndex =
      currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    setSelectedPhoto(photos[previousIndex]);
  }, [selectedPhoto, photos]);

  // Navigate to next photo
  const goToNext = useCallback(() => {
    if (!selectedPhoto || photos.length === 0) return;
    const currentIndex = photos.findIndex((p) => p._id === selectedPhoto._id);
    const nextIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
    setSelectedPhoto(photos[nextIndex]);
  }, [selectedPhoto, photos]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  return (
    <section className="min-h-screen text-white p-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full max-w-6xl"
      >
        <h2 className="text-4xl font-bold mb-8 text-center text-yellow-400">
          Photo Gallery
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Add some photos of the 60th party here!!!!!!
        </p>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 mb-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-yellow-500 bg-gray-900"
              : "border-gray-700 hover:border-gray-500"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-yellow-500">Drop the photos here...</p>
          ) : (
            <p className="text-gray-400">
              Drag & drop photos here, or click to select files
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <motion.div
              key={photo._id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-lg overflow-hidden bg-gray-800 cursor-pointer"
              onClick={() => photo.url && setSelectedPhoto(photo)}
            >
              {photo.url ? (
                <img
                  src={photo.url}
                  alt="Memory"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Loading...
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Full-screen photo viewer modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm z-10"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Left arrow - only show if there are multiple photos */}
            {photos.length > 1 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: 0.15 }}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm z-10 hover:scale-110 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </motion.button>
            )}

            {/* Right arrow - only show if there are multiple photos */}
            {photos.length > 1 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: 0.15 }}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm z-10 hover:scale-110 mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </motion.button>
            )}

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="absolute bottom-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm z-10"
              onClick={() => deletePhoto({ id: selectedPhoto._id })}
            >
              <Trash2 className="w-6 h-6 text-white" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.4,
              }}
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt="Memory"
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
