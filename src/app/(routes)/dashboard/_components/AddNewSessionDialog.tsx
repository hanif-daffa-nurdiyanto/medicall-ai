'use client'

import axios from 'axios';
import { ArrowRight, Loader2, Phone } from 'lucide-react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export type AiAgentDoctor = {
  id: number;
  name: string;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId?: string;
}

function AddNewSessionDialog() {
  const router = useRouter();

  const [note, setNote] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<AiAgentDoctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<AiAgentDoctor | null>(null);

  const onClickNext = async () => {
    setLoading(true);
    const result = await axios.post('/api/suggest-doctors', {
      notes: note,
    });
    setSuggestedDoctors(result.data);
    setSelectedDoctor(result.data[0].id ? result.data[0] : null);
    setLoading(false);
  }

  const onStartConsultation = async () => {
    setLoading(true);
    try{
      const result = await axios.post('/api/session-chat', {
        notes: note,
        selectedDoctor
      });
      if (result.data?.sessionId) { 
        router.push('/dashboard/medical-agent/' + result.data.sessionId);
      }
    } catch (error) {
      console.error(error);
    } finally{
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          const dialog = document.getElementById('new_session_dialog') as HTMLDialogElement | null;
          if (dialog) dialog.showModal();
        }}
        className="btn btn-primary"
      >
        <Phone className='w-5 mr-1.5' />
        Start Consultation
      </button>
      <dialog id="new_session_dialog" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{!suggestedDoctors.length ? 'Add Basic Details' : 'Suggested Doctors'}</h3>
          {!suggestedDoctors.length ?
            <>
              <p className="py-4">Add symtoms or any other details</p>
              <textarea
                className="textarea w-full"
                placeholder="Add details here..."
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </>
            :
            <div className="flex flex-col gap-2">
              <p className="py-4">Select a doctor from the list below</p>
              <ul className="list bg-base-100 rounded-box shadow-md">
                {suggestedDoctors.length > 0 && suggestedDoctors.map((doctor, index) => (
                    <li
                      className={`list-row ${selectedDoctor?.id === doctor.id ? 'bg-blue-300' : ''}`}
                      key={index}
                      onClick={() => setSelectedDoctor(doctor)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div>
                        <Image className="size-10 rounded-box image object-cover" width={120} height={120} src={'/doctor/' + doctor.image} alt='Image' />
                      </div>
                      <div>
                        <div>{doctor.name}</div>
                        <div className="text-xs uppercase font-semibold opacity-60">{doctor.specialist}</div>
                      </div>
                      <p className="list-col-wrap text-xs">
                        {doctor.description}
                      </p>
                    </li>
                ))}
              </ul>
            </div>
          }
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => setSuggestedDoctors([])}>Close</button>
            </form>
            { !suggestedDoctors.length ?
            <button
              className='btn'
              disabled={!note || loading}
              onClick={() => onClickNext()}
            >
              {
                loading ? <Loader2 className={`w-4 animate-spin`} /> : <>Next <ArrowRight className='w-4' /></>
              }
            </button> :
            <button
              className='btn'
              disabled={loading || !selectedDoctor}
              onClick={() => onStartConsultation()}
            >
              {
                loading ? <Loader2 className={`w-4 animate-spin`} /> : <>Start Consultation <ArrowRight className='w-4' /></>
              }
            </button>
            }
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default AddNewSessionDialog