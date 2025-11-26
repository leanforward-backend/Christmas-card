import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

export default function Goals() {
  const [text, setText] = useState("");
  const addGoal = useMutation(api.goals.add);
  const goals = useQuery(api.goals.list) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addGoal({ text });
    setText("");
  };

  return (
    <section className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full max-w-2xl"
      >
        <h2 className="text-4xl font-bold mb-8 text-center text-yellow-400">
          Future Goals
        </h2>

        <form onSubmit={handleSubmit} className="mb-12">
          <div className="flex flex-col gap-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write down a goal for the future..."
              className="w-full p-4 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all resize-none h-32"
            />
            <button
              type="submit"
              className="self-end px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Save Goal
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {goals.map((goal) => (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              <p className="text-lg">{goal.text}</p>
              <span className="text-sm text-gray-500">
                {new Date(goal.createdAt).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
          {goals.length === 0 && (
            <p className="text-center text-gray-500">
              No goals added yet. Start writing!
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
