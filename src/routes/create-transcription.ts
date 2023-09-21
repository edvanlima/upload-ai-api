import { FastifyInstance } from "fastify/types/instance"
import { createReadStream } from "node:fs"
import { prisma } from "../lib/prisma"
import { openai } from "../lib/openai"
import { z } from "zod"

export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post("/videos/:videoId/transcription", async (req) => {
    const paramsScheme = z.object({
      videoId: z.string().uuid(),
    })
    const { videoId } = paramsScheme.parse(req.params)

    const bodyScheme = z.object({
      prompt: z.string(),
    })

    const { prompt } = bodyScheme.parse(req.body)

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    })
    const videoPath = video.path

    const audioReadStream = createReadStream(videoPath)

    const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
      language: "pt",
      response_format: "json",
      temperature: 0,
      prompt,
    })

    const transcription = response.text
    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        transcription,
      },
    })

    return { transcription }
  })
}
