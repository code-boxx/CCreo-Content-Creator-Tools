# (PART A) INIT
# (A1) IMPORT
import os, sys, json
import speech_recognition as sr 
from pydub import AudioSegment
from pydub.silence import split_on_silence

# (A2) PATH
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
import A_path as tpath

# (A3) PARAMS
param = json.loads(sys.argv[1])

# (PART B) PROCESS AUDIO
# (B1) SPEECH RECOGNIZER & FILE PATH
recog = sr.Recognizer()
file_audio = os.path.join(tpath.output, param["file"])
file_chunk = os.path.join(tpath.output, "chunk.wav")
file_txt = os.path.join(tpath.output, "transcribe.txt")
audio = AudioSegment.from_file(file_audio)
txt = open(file_txt, "a")

# (B2) SPEECH TO TEXT IN CHUNKS
for i, chunk in enumerate(split_on_silence(audio,
  min_silence_len = 500,
  silence_thresh = audio.dBFS-14,
  keep_silence=500,
), start=1):
  chunk.export(file_chunk, format="wav")
  with sr.AudioFile(file_chunk) as source:
    trans = recog.recognize_google(recog.record(source))
    txt.write(trans.title() + ".\n")
txt.close()

# (B3) CLEAN UP
os.remove(file_audio)
os.remove(file_chunk)
print("OK")