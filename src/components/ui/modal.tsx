import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import dynamic from "next/dynamic";

const DialogClose = DialogPrimitive.Close;

const Modal = ({
    onGeneratePressed,
}: {
    onGeneratePressed: (prompt: string, inputSchema: string, outputSchema: string, dataSources: string, videoUrl: string | File | null) => void;
}) => {
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const handleGenerateClick = () => {
        const prompt = document.getElementById("prompt") as HTMLInputElement;
        const negativePrompt = document.getElementById("negative-prompt") as HTMLInputElement;
        const inputSchema = document.getElementById("input-schema") as HTMLInputElement;
        const outputSchema = document.getElementById("output-schema") as HTMLInputElement;
        const dataSources = document.getElementById("data-sources") as HTMLInputElement;

        if (prompt && inputSchema && outputSchema && dataSources) {
            onGeneratePressed(
                prompt.value + " Without the following things: " + negativePrompt.value,
                inputSchema.value,
                outputSchema.value,
                dataSources.value,
                videoFile || videoUrl
            );
        }
    };

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setVideoFile(event.target.files[0]);
            setVideoUrl(""); // Clear YouTube URL if a file is uploaded
        }
    };

    return (
        <Dialog defaultOpen>
            <DialogContent className="min-w-[560px] bg-white">
                <DialogHeader>
                    <DialogTitle>Let's Get Started</DialogTitle>
                    <DialogDescription>
                        Click Generate to Unlock Dynamic Editor and Generate Functions On-the-Fly!
                    </DialogDescription>
                </DialogHeader>
                <div className="bg-white rounded-md shadow p-6 w-120">
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="video-url">
                                YouTube Video URL
                            </label>
                            <Input
                                id="video-url"
                                placeholder="Paste YouTube video link"
                                value={videoUrl}
                                onChange={(e) => {
                                    setVideoUrl(e.target.value);
                                    setVideoFile(null); // Clear uploaded file if URL is entered
                                }}
                                disabled={videoFile !== null}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="video-file">
                                Upload a Video
                            </label>
                            <Input
                                id="video-file"
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                disabled={videoUrl !== ""}
                            />
                        </div>
                        <div className="flex justify-center mt-4">
                            <Link href="/videolearner">
                                <DialogPrimitive.Close className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                                    <Button className="bg-black text-white px-6 py-2" onClick={handleGenerateClick}>Generate</Button>
                                    <span className="sr-only">Close</span>
                                </DialogPrimitive.Close>
                            </Link>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default dynamic(() => Promise.resolve(Modal), { ssr: false });