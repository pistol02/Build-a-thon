"use client"
import React, { useCallback, useEffect } from "react";
import "gantt-schedule-timeline-calendar/dist/style.css";
import KanbanBoard from "@/components/ui/KanbanBoard";

let GSTC: any, gstc: any, state: any;

async function initializeGSTC(element: HTMLElement | null) {
    GSTC = (await import("gantt-schedule-timeline-calendar")).default;
    const TimelinePointer = (await import("gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js"))
        .Plugin;
    const Selection = (await import("gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js")).Plugin;
    const ItemResizing = (await import("gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js")).Plugin;
    const ItemMovement = (await import("gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js")).Plugin;

    // helper functions
    function generateRows() {
        const rows: any = {};
        const names = ["Saniyaa", "Vipul", "Vedant", "Saniyaa", "Varun", "Varun", "Vedant", "Vipul", "Vipul", "Vipul"];
        for (let i = 0; i < names.length; i++) {
            const id = `gstcid-${i}`; // Ensure row IDs start with "gstcid-"
            rows[id] = {
                id,
                label: names[i],
            };
        }
        return rows;
    }



    function generateItems() {
        const tasksByRow: { [key: string]: string[] } = {};
        const tasks = [
            "Sprint 9: Fixing a bug",
            "Sprint 9: Implementing feature",
            "Sprint 9: Refactoring code",
            "Sprint 9: Writing tests",
            "Sprint 9: Creating Figma design",
            "Sprint 9: Optimizing performance",
            "Sprint 10: Deploying application",
            "Sprint 10: Reviewing pull requests",
            "Sprint 10: Documenting code",
            "Sprint 10: Conducting code review",
            "Sprint 10: Meeting with stakeholders",
        ];
        const rows = Object.keys(generateRows());

        rows.forEach(rowId => {
            const tasksForThisRow: string[] = [];
            for (let i = 0; i < tasks.length; i++) { // Assign tasks sequentially
                tasksForThisRow.push(tasks[i]);
            }
            tasksByRow[rowId] = tasksForThisRow;
        });

        let start = GSTC.api.date().startOf("day").subtract(6, "day");
        const items: any = {};
        let taskIndex = 0; // Track the index of the task to assign
        for (let i = 0; i < 10; i++) {
            const id = GSTC.api.GSTCID(i.toString());
            const rowId = rows[Math.floor(Math.random() * rows.length)];
            start = start.add(1, "day");
            // Get the next task for this row
            const task = tasksByRow[rowId][taskIndex];
            items[id] = {
                id,
                label: task,
                rowId,
                time: {
                    start: start.valueOf(),
                    end: start.add(1, "day").endOf("day").valueOf(),
                },
            };
            // Increment the task index, reset if reaching the end of the tasks array
            taskIndex = (taskIndex + 1) % tasks.length;
        }

        return items;
    }



    const config = {
        licenseKey: "====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====",
        plugins: [TimelinePointer(), Selection(), ItemResizing(), ItemMovement()],
        list: {
            columns: {
                data: {
                    [GSTC.api.GSTCID("id")]: {
                        id: GSTC.api.GSTCID("id"),
                        width: 60,
                        data: ({ row }: { row: any }) => GSTC.api.sourceID(row.id),
                        header: {
                            content: "ID",
                        },
                    },
                    [GSTC.api.GSTCID("label")]: {
                        id: GSTC.api.GSTCID("label"),
                        width: 200,
                        data: "label",
                        header: {
                            content: "Label",
                        },
                    },
                },
            },
            rows: generateRows(),
        },
        chart: {
            items: generateItems(),
        },
    };

    state = GSTC.api.stateFromConfig(config);

    gstc = GSTC({
        element,
        state,
    });
}

const Taskanddeadline: React.FC = () => {
    const callback = useCallback((element: HTMLElement | null) => {
        if (element) initializeGSTC(element);
    }, []);

    useEffect(() => {
        return () => {
            if (gstc) {
                gstc.destroy();
            }
        };

    }, []);

    function updateFirstRow() {
        if (!GSTC || !state) return;
        state.update(`config.list.rows.${GSTC.api.GSTCID("0")}`, (row: any) => {
            row.label = "Changed dynamically";
            return row;
        });
    }

    return (
        <div className="container w-[80lvw] h-42">
            <h1 className="text-4xl font-bold m-4 text-gray-800 dark:text-white" >Task and Deadline tracking</h1>
            {/* <button onClick={updateFirstRow}>Change row 1 label</button> */}
            {/* <hr /> */}
            <div id="gstc" className="p-10" ref={callback}></div>
            <KanbanBoard/>
            <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
            Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
        .custom-gantt {
          width: 100%;
          height: 500px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .custom-gantt .gstc-grid .gstc-row-header,
        .custom-gantt .gstc-grid .gstc-header-column,
        .custom-gantt .gstc-chart .gstc-item {
          font-size: 14px;
        }

        .custom-gantt .gstc-grid .gstc-row-header {
          background-color: #f5f5f5;
          border-right: 1px solid #ddd;
        }

        .custom-gantt .gstc-grid .gstc-header-column {
          background-color: #f5f5f5;
          border-bottom: 1px solid #ddd;
        }

        .custom-gantt .gstc-chart {
          background-color: #fff;
        }

        .custom-gantt .gstc-chart .gstc-item {
          background-color: #38bdf8;
          color: white;
          border-radius: 4px;
          border: 1px solid transparent;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .custom-gantt .gstc-chart .gstc-item:hover {
          background-color: #2563eb;
        }
          
      `}</style>

        </div>
    );
};

export default Taskanddeadline;
