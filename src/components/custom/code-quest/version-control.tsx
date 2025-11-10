import { Button } from "@/components/ui/button";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PocketBase from 'pocketbase';
import { formatDistanceToNowStrict } from "date-fns"

export function VersionControl({
  setCode,
  setLang,
  inputRef,
  outputRef,
  dataSources,
  prompt
}: {
  setCode: any,
  setLang: any,
  inputRef: any,
  outputRef: any,
  dataSources: any,
  prompt: any
}) {
  const pb = new PocketBase('https://itbt.pockethost.io');
  const [versionData, setVersionData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    async function getHistory() {
      try {
        setLoading(true);
        const resultList = await pb.collection('history').getList(1, 40, {});
        setVersionData(resultList.items.reverse());
      } catch (e) {
        console.log(e)
      }
      finally {
        setLoading(false);
      }
    }

    getHistory();
  }, [auth]);

  async function handleOnVersionChoose(version: any) {
    console.log(version)
    setCode(version.code);
    setLang(version.language)
    prompt.current.value = version.prompt
    inputRef.current.value = version.schema.input;
    outputRef.current.value = version.schema.output;
  }

  return (
    <div className="h-screen p-2 bg-white">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">History</h2>
        <Button className="text-sm" variant="ghost">
          «
        </Button>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <ScrollArea className="space-y-4 h-full">
          {versionData.map((version: any) => (
            <Card
              key={version.revNo}
              className=" mt-4 bg-gray-100 rounded-md overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              onClick={() => { handleOnVersionChoose(version) }}
            >
              <CardHeader className="[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] text-white">
                <CardTitle className="font-bold text-lg">Version {version.revNo}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-2">
                  <div className="text-sm">{version.prompt.slice(0, 20)} ...</div>
                  <div className="flex justify-between items-center text-sm">
                    <span>{formatDistanceToNowStrict(new Date(version.created))} ago</span>
                    <span>LOC: {(version.code.match(/\n/g) || []).length}</span>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={version.pfp} className="rounded-full" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

        </ScrollArea>
      )}
    </div>
  );
}
