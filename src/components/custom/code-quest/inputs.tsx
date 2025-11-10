"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import { TerminalIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function InputChips({ inputRef, outputRef, dataSourcesRef }: { inputRef: any, outputRef: any, dataSourcesRef: any }) {
  const [activeTab, setActiveTab] = useState('Data Sources');

  return (
    <div className='overflow-y-auto h-full bg-white'>
    <Card>
      <CardContent>
        <div className="bg-white p-8 ">
          <div className="flex items-center space-x-4 pb-6 min-w-[300px]">
            <TerminalIcon className="text-black" />
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-2">
              {/* <ChipTabs1 setSelectedTab={setActiveTab} /> */}
            </div>
            {/* {activeTab === "Data Sources" && ( */}
              <div>
                <Label className="text-sm font-medium" htmlFor="dataSource">
                  Data Sources:
                </Label>
                <Textarea
                  ref={dataSourcesRef}
                  id="dataSource"
                  className="border-gray-300 border p-2 flex-grow"
                  rows={4}
                  placeholder="Enter data sources here..."
                />
              </div>
            {/* )} */}
            {/* {activeTab === "Input JSON" && ( */}
              <div>
                <Label className="text-sm font-medium" htmlFor="input">
                  Input JSON
                </Label>
                <Textarea className="min-h-32" id="input" ref={inputRef} placeholder="Enter input JSON here" />
              </div>
            {/* )} */}
            {/* {activeTab === "Output JSON" && ( */}
              <div>
                <Label className="text-sm font-medium" htmlFor="output">
                  Output JSON
                </Label>
                <Textarea className="min-h-32" ref={outputRef} id="output" placeholder="Output JSON will be displayed here" />
              </div>
            {/* )} */}
            
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
