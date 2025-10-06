'use client'
import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Bot, ClipboardList, FileText, Heart, PhoneCall, Sparkles, Stethoscope } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    title: "Tell us your symptoms",
    description: "Enter your symptoms and context so the AI doctor understands your needs before the call starts.",
    Icon: ClipboardList,
  },
  {
    title: "Talk with Doctor AI",
    description: "Connect instantly to a compassionate AI medical agent that guides you with evidence-based questions.",
    Icon: Stethoscope,
  },
  {
    title: "Get clear recommendations",
    description: "Receive actionable next steps, medication guidance, and lifestyle tips tailored to your condition.",
    Icon: Sparkles,
  },
  {
    title: "Download your report",
    description: "Keep a structured summary of the call including red flags, follow-up reminders, and key highlights.",
    Icon: FileText,
  },
];

const highlights = [
  {
    title: "AI doctor, human warmth",
    description: "Medicall AI listens deeply, adapts to your tone, and maps your answers to trusted medical protocols.",
    Icon: Bot,
  },
  {
    title: "Always-on support",
    description: "Reach out anytime 24/7 and never wait in a queue again—your health questions deserve instant answers.",
    Icon: PhoneCall,
  },
];

export default function HomePage() {
  const { user } = useUser();

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="absolute inset-x-0 top-[-20rem] h-[30rem] -rotate-6 bg-gradient-to-tr from-primary/30 via-primary/10 to-transparent blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="container mx-auto flex flex-1 flex-col px-6 pb-16 pt-24 lg:px-10">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-16">
            <motion.div
              className="flex flex-col gap-8 text-center lg:text-left"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-primary dark:border-primary/40 dark:bg-primary/20">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Meet Medicall AI</span>
              </div>

              <motion.h1
                className="text-4xl font-bold leading-tight text-slate-900 md:text-6xl dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Call a Doctor AI that cares about every symptom you share.
              </motion.h1>

              <motion.p
                className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300 lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                Medicall AI guides you from the moment you log your symptoms, through a live AI doctor call, to clear recommendations and an actionable report you can trust.
              </motion.p>

              <motion.div
                className="flex flex-wrap items-center justify-center gap-4 lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {!user ? (
                  <>
                    <Link href="/sign-up">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary btn-wide"
                      >
                        Start a call
                      </motion.button>
                    </Link>
                    <Link href="/sign-in">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-outline btn-primary"
                      >
                        Log in
                      </motion.button>
                    </Link>
                  </>
                ) : (
                  <div className="flex w-full flex-col gap-3 rounded-2xl bg-white/50 p-4 shadow-lg backdrop-blur dark:bg-slate-900/60 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                      <UserButton />
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-300">Welcome back</p>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">
                          Ready for your next consult?
                        </p>
                      </div>
                    </div>
                    <Link href="/dashboard">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary"
                      >
                        Go to dashboard
                      </motion.button>
                    </Link>
                  </div>
                )}
              </motion.div>

              <motion.div
                className="grid gap-6 sm:grid-cols-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
              >
                {highlights.map(({ title, description, Icon }) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-white/40 bg-white/60 p-6 text-left shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/70"
                  >
                    <Icon className="mb-4 h-8 w-8 text-primary" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </header>

        <section className="container mx-auto px-6 pb-24 lg:px-10">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How a Medicall AI session flows</h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
              From first symptom to final report, every step is tuned for clarity, empathy, and speed.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {steps.map(({ title, description, Icon }, index) => (
              <motion.div
                key={title}
                className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-6 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/70"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <span className="absolute right-6 top-6 text-5xl font-black text-primary/10">0{index + 1}</span>
                <Icon className="mb-5 h-10 w-10 text-primary" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6 pb-24 lg:px-10">
          <motion.div
            className="relative overflow-hidden rounded-[2.5rem] border border-primary/30 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-10 shadow-2xl backdrop-blur dark:from-primary/15 dark:via-primary/10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.6 }}
          >
            <div className="flex flex-col gap-6 text-slate-900 lg:flex-row lg:items-center lg:justify-between dark:text-white">
              <div className="max-w-2xl">
                <h3 className="text-2xl font-semibold">Feel confident before you hit call.</h3>
                <p className="mt-3 text-base text-slate-700 dark:text-slate-200">
                  Upload photos, share your vitals, and let Medicall AI summarize everything for you. Spend the call understanding recommendations—not repeating your story.
                </p>
              </div>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary btn-wide"
                >
                  Explore the dashboard
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        <footer className="mt-auto border-t border-white/40 bg-white/70 py-6 text-center text-sm text-slate-600 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
          <span className="inline-flex items-center justify-center gap-2">
            Made with <Heart className="h-4 w-4 text-rose-500" aria-hidden /> by Hanif Daffa N
          </span>
        </footer>
      </div>
    </main>
  );
}
