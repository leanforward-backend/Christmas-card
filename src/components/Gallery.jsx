import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "../../convex/_generated/api";

export default function Gallery() {
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const savePhoto = useMutation(api.photos.save);
  const photos = useQuery(api.photos.list) || [];

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

  return (
    <section className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
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
              className="aspect-square rounded-lg overflow-hidden bg-gray-800"
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
    </section>
  );
}
