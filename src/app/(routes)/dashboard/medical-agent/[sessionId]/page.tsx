/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiAgentDoctor } from "../../_components/AddNewSessionDialog";
import Image from "next/image";
import { Phone, PhoneOff } from "lucide-react";
import { motion } from "framer-motion";
import Vapi from "@vapi-ai/web";

type SessionDetails = {
  id: number;
  sessionId: string;
  report: JSON;
  selectedDoctor: AiAgentDoctor;
  createdBy: string;
  notes: string;
  createOn: string;
};

type messages={
  role: string;
  text: string;
}

function VoiceAgent() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(
    null
  );
  const [callStarted, setCallStarted] = useState(false);
  const GetSessionDetails = async () => {
    const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
    setSessionDetails(result.data);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [vapiInstance, setVapiInstance] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string | null>(null);
  const [messages, setMessage] = useState<messages[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    GetSessionDetails();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (callStarted) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (callStarted === false && interval)  {
      clearInterval(interval);
      setTimer(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStarted]);

  const formatTimer = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const startCall = () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY || "");
    setVapiInstance(vapi);

    // const VapiAgentConfig={
    //   name: "General Practitioner",
    //   firstMessage: "Hello, how can I assist you today?",
    //   transcriber :{
    //     provider: 'assembly-ai',
    //     language: 'en'
    //   },
    //   voice:{
    //     provider:'vapi',
    //     voiceId: 'Elliot'
    //   },
    //   model:{
    //     provider:'openai',
    //     modelId: 'gpt-4',
    //     messages: [
    //       {
    //         role: 'system',
    //         content: sessionDetails?.selectedDoctor.agentPrompt || "Hello, how can I assist you today?"
    //       }
    //     ]
    //   }
    // }
    // @ts-ignore
    vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID || "");
    vapi.on("call-start", () => {
      console.log("Call started");
      setCallStarted(true);
    });
    vapi.on("call-end", () => {
      console.log("Call ended");
      setTimer(0);
      setCallStarted(false);
    });
    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          setLiveTranscript("");
          setCurrentRole(null);
          setMessage((prevMessages) => {
            if (
              prevMessages.length > 0 &&
              prevMessages[prevMessages.length - 1].role === role
            ) {
              const updatedMessages = [...prevMessages];
              updatedMessages[updatedMessages.length - 1].text += " " + transcript;
              return updatedMessages;
            } else {
              return [...prevMessages, { role, text: transcript }];
            }
          });
        }
      }
    });

    vapi.on("speech-start", () => {
      console.log("Assistant started speaking");
      setCurrentRole("assistant");
    });

    vapiInstance?.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setCurrentRole("user");
    });
  };

  const endCall = async () => {
    if (!vapiInstance) return;

    setLoading(true);

    console.log(vapiInstance);
    vapiInstance.stop();

    // vapiInstance.off("call-start");
    // vapiInstance.off("call-end");
    // vapiInstance.off("message");

    setCallStarted(false);
    setVapiInstance(null);

    const result = await generateReport();
    router.replace('/dashboard');
    setLoading(false);
  };

  const generateReport = async () => {
    const res = await axios.post("/api/report", {
      messages,
      sessionId,
      sessionDetails
    });

    const data = res.data;
    console.log("Generated Report:", data);
    return data;
  }

  return (
    <div className="container mx-auto py-24 flex">
      <div className="mockup-phone border-primary h-[36rem] w-[18rem] cursor-pointer">
        <div className="mockup-phone-camera translate-y-2"></div>
        <div className="mockup-phone-display h-full w-full">
          <div className="w-full h-full bg-white dark:bg-slate-600 flex items-center justify-center flex-col gap-4">
            <div className="avatar">
              <div className="w-32 rounded-full">
                <Image
                  className="size-10 rounded-box object-cover object-top"
                  width={120}
                  height={120}
                  src={"/doctor/" + sessionDetails?.selectedDoctor.image}
                  alt="Image"
                />
              </div>
            </div>
            <div>{formatTimer(timer)}</div>
            <div>
              <div className="text-md font-medium dark:text-white">
                {sessionDetails?.selectedDoctor.name}
              </div>
              <div className="text-xs opacity-60 tracking-wide text-center px-4">
                {sessionDetails?.selectedDoctor.specialist}
              </div>
            </div>
            {!callStarted ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="btn btn-success w-14 h-14 rounded-full text-white"
                onClick={startCall}
              >
                <Phone />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="btn btn-error w-14 h-14 rounded-full text-white"
                onClick={endCall}
              >
                <PhoneOff />
              </motion.button>
            )}
          </div>
        </div>
      </div>
      <div className="ml-4 px-16 flex-1">
        <div>
          <h2 className="text-lg font-medium">In Call</h2>
          <div className="mt-2">
            <p className="text-sm">
              <strong>Notes:</strong> {sessionDetails?.notes}
            </p>
          </div>
        </div>
        <div className="mt-32 text-center overflow-y-auto">
          {messages?.slice(-4).map((message, index) => (
            <p key={index} className="text-gray-400 p-2">
              {message.role}: {message.text}
            </p>
          ))}
          {liveTranscript && liveTranscript.length > 0 && (
            <p className="text-gray-800 dark:text-gray-200">{currentRole}: {liveTranscript}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoiceAgent;
