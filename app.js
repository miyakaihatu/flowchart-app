{\rtf1\ansi\ansicpg932\cocoartf2639
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset128 HiraginoSans-W3;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 (function () \{\
  const tree = window.DECISION_TREE;\
\
  const el = (id) => document.getElementById(id);\
  const qa = el("qa");\
  const result = el("result");\
  const qEl = el("question");\
  const optsEl = el("options");\
  const textWrap = el("textwrap");\
  const textEl = el("text");\
  const textNextBtn = el("textNext");\
  const bar = el("bar");\
\
  const summaryEl = el("summary");\
  const nextQsEl = el("nextQs");\
  const replySoftEl = el("replySoft");\
  const replyShortEl = el("replyShort");\
  const promptEl = el("prompt");\
\
  const backBtn = el("back");\
  const resetBtn = el("reset");\
  const restartBtn = el("restart");\
  const copyAllBtn = el("copyAll");\
\
  let history = [];\
  let state = \{\};\
  let currentId = tree.start;\
\
  const labelOf = (nodeId, value) => \{\
    const node = tree.nodes[nodeId];\
    if (!node || !node.options) return String(value ?? "");\
    const hit = node.options.find(o => o.value === value);\
    return hit ? hit.label : String(value ?? "");\
  \};\
\
  const progressPct = () => \{\
    // 
\f1 \'8c\'b5\'96\'a7\'82\'c9\'90\'94\'82\'a6\'82\'c8\'82\'a2\'81\'42\'90\'6c\'8a\'d4\'82\'cd\'90\'69\'92\'bb\'83\'6f\'81\'5b\'82\'aa\'93\'ae\'82\'af\'82\'ce\'97\'8e\'82\'bf\'92\'85\'82\'ad\'90\'b6\'82\'ab\'95\'a8\'82\'c8\'82\'cc\'82\'c5\'81\'42
\f0 \
    const steps = Math.min(10, Math.max(1, history.length + 1));\
    return Math.min(100, (steps / 10) * 100);\
  \};\
\
  const setProgress = () => \{\
    bar.style.width = `$\{progressPct()\}%`;\
  \};\
\
  const render = () => \{\
    setProgress();\
    const node = tree.nodes[currentId];\
    if (!node) throw new Error("Unknown node: " + currentId);\
\
    if (node.type === "finish") \{\
      showResult(node.reason);\
      return;\
    \}\
\
    qEl.textContent = node.question;\
    optsEl.innerHTML = "";\
    textWrap.classList.add("hidden");\
\
    if (node.type === "single") \{\
      node.options.forEach(opt => \{\
        const b = document.createElement("button");\
        b.className = "opt";\
        b.textContent = opt.label;\
        b.onclick = () => \{\
          history.push(currentId);\
          state[currentId] = opt.value;\
          currentId = opt.next;\
          render();\
        \};\
        optsEl.appendChild(b);\
      \});\
    \}\
\
    if (node.type === "text") \{\
      textWrap.classList.remove("hidden");\
      textEl.value = state[node.key] || "";\
      textNextBtn.onclick = () => \{\
        const v = (textEl.value || "").trim();\
        history.push(currentId);\
        state[node.key] = v;\
        currentId = node.next;\
        render();\
      \};\
    \}\
  \};\
\
  const showResult = (reason) => \{\
    qa.classList.add("hidden");\
    result.classList.remove("hidden");\
\
    const topic = labelOf("topic", state["topic"]);\
    const goal = labelOf("goal", state["goal"]);\
    const tone = labelOf("tone", state["tone"]);\
    const msg = (state.message || "").trim();\
\
    // 
\f1 \'97\'76\'96\'f1
\f0 \
    const lines = [];\
    lines.push(`
\f1 \'83\'57\'83\'83\'83\'93\'83\'8b
\f0 : $\{topic || "
\f1 \'96\'a2\'91\'49\'91\'f0
\f0 "\}`);\
    lines.push(`
\f1 \'91\'8a\'8e\'e8\'82\'cc\'8b\'81\'82\'df
\f0 : $\{goal || "
\f1 \'96\'a2\'91\'49\'91\'f0
\f0 "\}`);\
    lines.push(`
\f1 \'95\'d4\'93\'9a\'83\'67\'81\'5b\'83\'93
\f0 : $\{tone || "
\f1 \'96\'a2\'91\'49\'91\'f0
\f0 "\}`);\
    if (state["urgency_health"]) lines.push(`
\f1 \'91\'cc\'92\'b2\'8c\'6e\'82\'cc\'8b\'d9\'8b\'7d\'93\'78
\f0 : $\{labelOf("urgency_health", state["urgency_health"])\}`);\
    if (state["urgency_mental"]) lines.push(`
\f1 \'83\'81\'83\'93\'83\'5e\'83\'8b\'8c\'6e\'82\'cc\'8b\'d9\'8b\'7d\'93\'78
\f0 : $\{labelOf("urgency_mental", state["urgency_mental"])\}`);\
    if (state["urgency_sensitive"]) lines.push(`
\f1 \'83\'5a\'83\'93\'83\'56\'83\'65\'83\'42\'83\'75\'92\'8d\'88\'d3
\f0 : $\{labelOf("urgency_sensitive", state["urgency_sensitive"])\}`);\
    lines.push("");\
    lines.push("
\f1 \'91\'8a\'8e\'e8\'95\'b6\'96\'ca\'97\'76\'96\'f1
\f0 /
\f1 \'8c\'b4\'95\'b6
\f0 :");\
    lines.push(msg || "
\f1 \'81\'69\'96\'a2\'93\'fc\'97\'cd\'81\'6a
\f0 ");\
\
    summaryEl.textContent = lines.join("\\n");\
\
    // 
\f1 \'8e\'9f\'82\'c9\'95\'b7\'82\'ad\'8e\'bf\'96\'e2\'81\'69\'83\'65\'83\'93\'83\'76\'83\'8c\'81\'6a
\f0 \
    const nextQs = buildNextQuestions();\
    nextQsEl.textContent = nextQs.map(q => "
\f1 \'81\'45
\f0 " + q).join("\\n");\
\
    // 
\f1 \'95\'d4\'90\'4d\'83\'65\'83\'93\'83\'76\'83\'8c
\f0 \
    const replies = buildReplies(reason);\
    replySoftEl.textContent = replies.soft;\
    replyShortEl.textContent = replies.short;\
\
    // ChatGPT
\f1 \'83\'76\'83\'8d\'83\'93\'83\'76\'83\'67
\f0 \
    promptEl.textContent = buildPrompt(reason, nextQs);\
  \};\
\
  const buildNextQuestions = () => \{\
    const topic = state.topic;\
    const goal = state.goal;\
\
    const common = [\
      "
\f1 \'82\'a2\'82\'dc\'88\'ea\'94\'d4\'82\'c2\'82\'e7\'82\'a2\'82\'cc\'82\'cd\'81\'75\'8f\'6f\'97\'88\'8e\'96\'81\'76\'81\'48\'82\'bb\'82\'ea\'82\'c6\'82\'e0\'81\'75\'8b\'43\'8e\'9d\'82\'bf\'81\'76\'81\'48
\f0 ",\
      "
\f1 \'82\'c7\'82\'a4\'82\'c8\'82\'c1\'82\'bd\'82\'e7\'8f\'ad\'82\'b5\'8a\'79\'82\'c9\'82\'c8\'82\'e9\'81\'48\'81\'69\'97\'9d\'91\'7a\'82\'cc\'83\'53\'81\'5b\'83\'8b\'81\'6a
\f0 ",\
      "
\f1 \'8d\'a1\'93\'fa\'82\'cd
\f0 \'93
\f1 \'95\'b7\'82\'a2\'82\'c4\'82\'d9\'82\'b5\'82\'a2\'93\'fa
\f0 \'94
\f1 \'82\'a9\'81\'41
\f0 \'93
\f1 \'95\'fb\'90\'6a\'82\'aa\'82\'d9\'82\'b5\'82\'a2\'93\'fa
\f0 \'94
\f1 \'82\'a9\'82\'c7\'82\'c1\'82\'bf\'81\'48
\f0 "\
    ];\
\
    const byTopic = \{\
      relationship: [\
        "
\f1 \'91\'8a\'8e\'e8\'82\'c6\'82\'cc\'8a\'d6\'8c\'57\'90\'ab\'81\'69\'94\'de\'8e\'81
\f0 /
\f1 \'97\'46\'92\'42
\f0 /
\f1 \'90\'45\'8f\'ea
\f0 /
\f1 \'89\'c6\'91\'b0\'81\'6a\'82\'cd\'81\'48
\f0 ",\
        "
\f1 \'82\'a2\'82\'dc\'8b\'4e\'82\'ab\'82\'c4\'82\'e9\'96\'e2\'91\'e8\'82\'cd\'81\'41\'95\'70\'93\'78\'82\'c7\'82\'ea\'82\'ad\'82\'e7\'82\'a2\'81\'48\'81\'69\'88\'ea\'89\'f1\'82\'be\'82\'af
\f0 /
\f1 \'8c\'4a\'82\'e8\'95\'d4\'82\'b5\'81\'6a
\f0 ",\
        "
\f1 \'91\'8a\'8e\'e8\'82\'c9\'89\'bd\'82\'f0\'93\'60\'82\'a6\'82\'bd\'82\'a2\'81\'48\'8b\'74\'82\'c9\'81\'41\'89\'bd\'82\'cd\'8c\'be\'82\'a2\'82\'c9\'82\'ad\'82\'a2\'81\'48
\f0 "\
      ],\
      health: [\
        "
\f1 \'8f\'c7\'8f\'f3\'82\'cd\'82\'a2\'82\'c2\'82\'a9\'82\'e7\'81\'48\'88\'ab\'89\'bb\'82\'b5\'82\'c4\'82\'e9\'81\'48
\f0 ",\
        "
\f1 \'92\'c9\'82\'dd
\f0 /
\f1 \'94\'ad\'94\'4d
\f0 /
\f1 \'8f\'6f\'8c\'8c\'82\'c8\'82\'c7\'82\'cc
\f0 \'93
\f1 \'90\'d4\'90\'4d\'8d\'86
\f0 \'94
\f1 \'82\'cd\'82\'a0\'82\'e9\'81\'48
\f0 ",\
        "
\f1 \'8e\'f3\'90\'66\'82\'c5\'82\'ab\'82\'bb\'82\'a4\'81\'48\'95\'73\'88\'c0\'82\'cc\'83\'7c\'83\'43\'83\'93\'83\'67\'82\'cd\'82\'c7\'82\'b1\'81\'48
\f0 "\
      ],\
      mental: [\
        "
\f1 \'96\'b0\'82\'ea\'82\'c4\'82\'e9\'81\'48\'90\'48\'82\'d7\'82\'ea\'82\'c4\'82\'e9\'81\'48\'81\'69\'8d\'c5\'92\'e1\'8c\'c0\'81\'6a
\f0 ",\
        "
\f1 \'95\'73\'88\'c0\'82\'aa\'8b\'ad\'82\'ad\'82\'c8\'82\'e9\'83\'5e\'83\'43\'83\'7e\'83\'93\'83\'4f\'82\'cd\'81\'48
\f0 ",\
        "
\f1 \'88\'ea\'90\'6c\'82\'c5\'95\'f8\'82\'a6\'82\'c4\'82\'c8\'82\'a2\'81\'48\'91\'8a\'92\'6b\'82\'c5\'82\'ab\'82\'e9\'90\'6c\'82\'a2\'82\'e9\'81\'48
\f0 "\
      ],\
      sensitive: [\
        "
\f1 \'96\'b3\'97\'9d\'82\'b5\'82\'c4\'82\'e9\'8a\'b4\'82\'b6\'82\'e2\'92\'c9\'82\'dd\'82\'cd\'82\'a0\'82\'e9\'81\'48\'81\'69\'82\'a0\'82\'e9\'82\'c8\'82\'e7\'8d\'c5\'97\'44\'90\'e6\'82\'c5\'8e\'7e\'82\'df\'82\'e9\'81\'6a
\f0 ",\
        "
\f1 \'91\'8a\'8e\'e8\'82\'cc\'83\'79\'81\'5b\'83\'58\'82\'c6\'93\'af\'88\'d3\'82\'cd\'96\'be\'8a\'6d\'81\'48
\f0 ",\
        "\'93
\f1 \'8b\'43\'8e\'9d\'82\'bf\'82\'e6\'82\'b3
\f0 \'94
\f1 \'82\'e6\'82\'e8\'90\'e6\'82\'c9
\f0 \'93
\f1 \'88\'c0\'90\'53
\f0 \'94
\f1 \'82\'aa\'91\'ab\'82\'e8\'82\'c4\'82\'e9\'81\'48
\f0 "\
      ],\
      other: [\
        "
\f1 \'89\'bd\'82\'aa\'8b\'4e\'93\'5f\'82\'c5\'82\'bb\'82\'a4\'82\'c8\'82\'c1\'82\'bd\'81\'48\'81\'69\'82\'ab\'82\'c1\'82\'a9\'82\'af\'81\'6a
\f0 ",\
        "
\f1 \'91\'49\'82\'d7\'82\'e9\'91\'49\'91\'f0\'8e\'88\'82\'cd\'89\'bd\'82\'aa\'82\'a0\'82\'e9\'81\'48
\f0 ",\
        "
\f1 \'8d\'c5\'92\'5a\'82\'c5\'8a\'79\'82\'c9\'82\'c8\'82\'e9\'88\'ea\'8e\'e8\'82\'cd\'89\'bd\'82\'be\'82\'c6\'8e\'76\'82\'a4\'81\'48
\f0 "\
      ]\
    \};\
\
    let qs = [...common];\
    qs = qs.concat(byTopic[topic] || byTopic.other);\
\
    if (goal === "listen") qs.unshift("
\f1 \'82\'dc\'82\'b8\'8b\'a4\'8a\'b4\'82\'b5\'82\'c4\'82\'d9\'82\'b5\'82\'a2\'81\'48\'89\'f0\'8c\'88\'8d\'f4\'82\'d9\'82\'b5\'82\'a2\'81\'48\'82\'c7\'82\'c1\'82\'bf\'82\'aa\'8b\'df\'82\'a2\'81\'48
\f0 ");\
    if (goal === "plan") qs.unshift("
\f1 \'97\'9d\'91\'7a\'82\'cc\'8f\'f3\'91\'d4\'82\'f0
\f0 0
\f1 \'81\'60
\f0 10
\f1 \'82\'c5\'8c\'be\'82\'a4\'82\'c6\'8d\'a1\'82\'c7\'82\'ea\'82\'ad\'82\'e7\'82\'a2\'81\'48\'8e\'9f\'82\'cd\'89\'bd\'93\'5f\'82\'f0\'96\'da\'8e\'77\'82\'b7\'81\'48
\f0 ");\
\
    // 
\f1 \'8f\'64\'95\'a1\'82\'f0\'82\'b4\'82\'c1\'82\'ad\'82\'e8\'8f\'9c\'8b\'8e
\f0 \
    return Array.from(new Set(qs)).slice(0, 6);\
  \};\
\
  const buildReplies = (reason) => \{\
    if (reason === "minor_unknown") \{\
      return \{\
        soft: "
\f1 \'94\'4e\'97\'ee\'82\'aa\'95\'73\'96\'be\'82\'c8\'82\'cc\'82\'c5\'81\'41\'93\'a5\'82\'dd\'8d\'9e\'82\'dd\'82\'b7\'82\'ac\'82\'c8\'82\'a2\'94\'cd\'88\'cd\'82\'c5\'82\'b5\'82\'a9\'95\'d4\'82\'b9\'82\'c8\'82\'a2\'82\'c5\'82\'b7\'81\'42\'88\'c0\'91\'53\'82\'cc\'82\'bd\'82\'df\'81\'41\'82\'dc\'82\'b8\'82\'cd\'81\'75\'94\'4e\'97\'ee\'81\'69
\f0 18
\f1 \'8d\'ce\'88\'c8\'8f\'e3\'82\'a9\'81\'6a\'81\'76\'82\'c6\'81\'75\'91\'8a\'92\'6b\'82\'cc\'83\'57\'83\'83\'83\'93\'83\'8b\'81\'76\'82\'f0\'8a\'6d\'94\'46\'82\'b3\'82\'b9\'82\'c4\'82\'ad\'82\'be\'82\'b3\'82\'a2\'81\'42
\f0 ",\
        short: "
\f1 \'94\'4e\'97\'ee\'82\'aa\'95\'73\'96\'be\'82\'c8\'82\'cc\'82\'c5\'81\'41\'82\'dc\'82\'b8
\f0 18
\f1 \'8d\'ce\'88\'c8\'8f\'e3\'82\'a9\'8b\'b3\'82\'a6\'82\'c4\'81\'42\'88\'c0\'91\'53\'82\'cc\'82\'bd\'82\'df\'8a\'6d\'94\'46\'82\'b5\'82\'bd\'82\'a2\'81\'42
\f0 "\
      \};\
    \}\
    if (reason === "crisis") \{\
      return \{\
        soft: "
\f1 \'82\'a2\'82\'dc\'82\'cc\'95\'b6\'96\'ca\'82\'be\'82\'c6\'81\'41\'82\'a0\'82\'c8\'82\'bd\'82\'cc\'88\'c0\'91\'53\'82\'aa\'88\'ea\'94\'d4\'91\'e5\'8e\'96\'82\'c9\'8c\'a9\'82\'a6\'82\'dc\'82\'b7\'81\'42\'82\'d0\'82\'c6\'82\'e8\'82\'c5\'95\'f8\'82\'a6\'82\'c8\'82\'a2\'82\'c5\'81\'41\'8d\'a1\'82\'b7\'82\'ae\'90\'4d\'97\'8a\'82\'c5\'82\'ab\'82\'e9\'90\'6c\'82\'a9\'81\'41\'92\'6e\'88\'e6\'82\'cc\'91\'8a\'92\'6b\'91\'8b\'8c\'fb
\f0 /
\f1 \'88\'e3\'97\'c3\'82\'c9\'8c\'71\'82\'aa\'82\'c1\'82\'c4\'82\'d9\'82\'b5\'82\'a2\'81\'42\'82\'e0\'82\'b5\'8d\'b7\'82\'b5\'8e\'78\'82\'a6\'82\'c8\'82\'af\'82\'ea\'82\'ce\'81\'75\'82\'a2\'82\'dc\'88\'ea\'90\'6c\'81\'48\'81\'76\'81\'75\'88\'c0\'91\'53\'82\'c8\'8f\'ea\'8f\'8a\'82\'c9\'82\'a2\'82\'e9\'81\'48\'81\'76\'82\'be\'82\'af\'8b\'b3\'82\'a6\'82\'c4\'81\'42
\f0 ",\
        short: "
\f1 \'88\'c0\'91\'53\'82\'aa\'8d\'c5\'97\'44\'90\'e6\'81\'42\'8d\'a1\'82\'b7\'82\'ae\'90\'67\'8b\'df\'82\'c8\'90\'6c
\f0 /
\f1 \'91\'8a\'92\'6b\'91\'8b\'8c\'fb\'82\'c9\'8c\'71\'82\'aa\'82\'c1\'82\'c4\'81\'42\'82\'a2\'82\'dc\'88\'ea\'90\'6c\'81\'48\'88\'c0\'91\'53\'82\'c8\'8f\'ea\'8f\'8a\'81\'48
\f0 "\
      \};\
    \}\
\
    const goal = state.goal;\
    const topic = state.topic;\
    const msg = (state.message || "").trim();\
\
    const opener =\
      goal === "listen"\
        ? "
\f1 \'98\'62\'82\'b5\'82\'c4\'82\'ad\'82\'ea\'82\'c4\'82\'a0\'82\'e8\'82\'aa\'82\'c6\'82\'a4\'81\'42\'82\'dc\'82\'b8\'81\'41\'82\'b5\'82\'f1\'82\'c7\'82\'a9\'82\'c1\'82\'bd\'82\'e6\'82\'cb\'81\'42
\f0 "\
        : "
\f1 \'98\'62\'82\'b5\'82\'c4\'82\'ad\'82\'ea\'82\'c4\'82\'a0\'82\'e8\'82\'aa\'82\'c6\'82\'a4\'81\'42\'8f\'f3\'8b\'b5\'90\'ae\'97\'9d\'82\'b5\'82\'c2\'82\'c2\'81\'41\'8e\'9f\'82\'cc\'88\'ea\'8e\'e8\'82\'f0\'88\'ea\'8f\'8f\'82\'c9\'8d\'6c\'82\'a6\'82\'e9\'82\'cb\'81\'42
\f0 ";\
\
    const caution =\
      (topic === "health" && state.urgency_health === "red")\
        ? "
\f1 \'95\'b6\'96\'ca\'82\'be\'82\'af\'82\'be\'82\'c6\'94\'bb\'92\'66\'82\'b5\'82\'ab\'82\'ea\'82\'c8\'82\'a2\'82\'af\'82\'c7\'81\'41\'8e\'f3\'90\'66\'83\'8c\'83\'78\'83\'8b\'82\'cc\'89\'c2\'94\'5c\'90\'ab\'82\'e0\'82\'a0\'82\'e9\'82\'a9\'82\'e7\'96\'b3\'97\'9d\'82\'b9\'82\'b8\'88\'e3\'97\'c3\'82\'c9\'8c\'71\'82\'ae\'82\'cc\'82\'aa\'88\'c0\'91\'53\'81\'42
\f0 "\
        : (topic === "sensitive" && state.urgency_sensitive === "red")\
        ? "
\f1 \'96\'b3\'97\'9d\'82\'e2\'92\'c9\'82\'dd\'82\'aa\'82\'a0\'82\'e9\'82\'c8\'82\'e7
\f0 \'93
\f1 \'8b\'43\'8e\'9d\'82\'bf\'82\'e6\'82\'b3
\f0 \'94
\f1 \'88\'c8\'91\'4f\'82\'c9\'81\'41\'82\'a2\'82\'c1\'82\'bd\'82\'f1\'8e\'7e\'82\'df\'82\'c4\'88\'c0\'91\'53\'8a\'6d\'95\'db\'82\'aa\'8d\'c5\'97\'44\'90\'e6\'81\'42
\f0 "\
        : "";\
\
    const ask =\
      goal === "listen"\
        ? "
\f1 \'8d\'a1\'82\'cd\'81\'41\'89\'f0\'8c\'88\'8d\'f4\'82\'e6\'82\'e8\'81\'75\'95\'b7\'82\'a2\'82\'c4\'82\'d9\'82\'b5\'82\'a2\'81\'76\'8a\'b4\'82\'b6\'81\'48\'82\'bb\'82\'ea\'82\'c6\'82\'e0\'81\'75\'82\'c7\'82\'a4\'82\'b5\'82\'bd\'82\'e7\'82\'a2\'82\'a2\'82\'a9\'81\'76\'82\'e0\'97\'7e\'82\'b5\'82\'a2\'81\'48
\f0 "\
        : "
\f1 \'82\'dc\'82\'b8\'8a\'6d\'94\'46\'82\'b5\'82\'bd\'82\'a2\'81\'42\'82\'a2\'82\'dc\'88\'ea\'94\'d4\'8d\'a2\'82\'c1\'82\'c4\'82\'e9\'82\'cc\'82\'cd\'81\'41\'82\'c7\'82\'cc\'95\'94\'95\'aa\'81\'48\'81\'69\'8f\'6f\'97\'88\'8e\'96
\f0 /
\f1 \'8b\'43\'8e\'9d\'82\'bf
\f0 /
\f1 \'91\'8a\'8e\'e8\'82\'cc\'94\'bd\'89\'9e
\f0  
\f1 \'82\'c7\'82\'ea\'82\'aa\'91\'e5\'82\'ab\'82\'a2\'81\'48\'81\'6a
\f0 ";\
\
    const soft = [\
      opener,\
      caution && (" " + caution),\
      "",\
      "
\f1 \'82\'e6\'82\'a9\'82\'c1\'82\'bd\'82\'e7\'81\'41\'82\'b1\'82\'ea\'82\'be\'82\'af\'8b\'b3\'82\'a6\'82\'c4\'81\'42
\f0 ",\
      "
\f1 \'81\'45\'82\'a2\'82\'dc\'88\'ea\'94\'d4\'82\'c2\'82\'e7\'82\'a2\'82\'cc\'82\'cd\'81\'75\'8f\'6f\'97\'88\'8e\'96\'81\'76\'81\'48\'82\'bb\'82\'ea\'82\'c6\'82\'e0\'81\'75\'8b\'43\'8e\'9d\'82\'bf\'81\'76\'81\'48
\f0 ",\
      "
\f1 \'81\'45\'82\'c7\'82\'a4\'82\'c8\'82\'c1\'82\'bd\'82\'e7\'8f\'ad\'82\'b5\'8a\'79\'82\'c9\'82\'c8\'82\'e9\'81\'48\'81\'69\'97\'9d\'91\'7a\'82\'cc\'83\'53\'81\'5b\'83\'8b\'81\'6a
\f0 ",\
      ask,\
      "",\
      msg ? "
\f1 \'81\'69\'82\'a0\'82\'c8\'82\'bd\'82\'cc\'95\'b6\'96\'ca\'81\'41\'82\'bf\'82\'e1\'82\'f1\'82\'c6\'93\'c7\'82\'f1\'82\'be\'82\'e6\'81\'6a
\f0 " : ""\
    ].filter(Boolean).join("\\n");\
\
    const short = [\
      "
\f1 \'82\'a0\'82\'e8\'82\'aa\'82\'c6\'82\'a4\'81\'42\'82\'dc\'82\'b8\'8f\'f3\'8b\'b5\'90\'ae\'97\'9d\'82\'b3\'82\'b9\'82\'c4\'81\'42
\f0 ",\
      caution && ("\uc0\u8251 " + caution),\
      "
\f1 \'82\'a2\'82\'dc\'88\'ea\'94\'d4\'82\'c2\'82\'e7\'82\'a2\'82\'cc\'82\'cd\'81\'75\'8f\'6f\'97\'88\'8e\'96
\f0 /
\f1 \'8b\'43\'8e\'9d\'82\'bf\'81\'76\'82\'c7\'82\'c1\'82\'bf\'81\'48
\f0 ",\
      "
\f1 \'8d\'a1\'93\'fa\'82\'cd\'95\'b7\'82\'a2\'82\'c4\'82\'d9\'82\'b5\'82\'a2\'93\'fa\'81\'48\'95\'fb\'90\'6a\'82\'d9\'82\'b5\'82\'a2\'93\'fa\'81\'48
\f0 "\
    ].filter(Boolean).join("\\n");\
\
    return \{ soft, short \};\
  \};\
\
  const buildPrompt = (reason, nextQs) => \{\
    const topic = labelOf("topic", state.topic);\
    const goal = labelOf("goal", state.goal);\
    const tone = labelOf("tone", state.tone);\
    const msg = (state.message || "").trim();\
\
    return [\
      "
\f1 \'82\'a0\'82\'c8\'82\'bd\'82\'cd\'8f\'97\'90\'ab\'8c\'fc\'82\'af\'91\'8a\'92\'6b\'91\'ce\'89\'9e\'82\'cc\'83\'76\'83\'8d\'82\'cc\'83\'4a\'83\'45\'83\'93\'83\'5a\'83\'89\'81\'5b\'8c\'93\'83\'52\'83\'7e\'83\'85\'83\'6a\'83\'50\'81\'5b\'83\'56\'83\'87\'83\'93\'83\'52\'81\'5b\'83\'60\'81\'42
\f0 ",\
      "
\f1 \'96\'da\'93\'49\'81\'46\'91\'8a\'8e\'e8\'82\'cc\'89\'b7\'93\'78\'8a\'b4\'81\'69\'8b\'a4\'8a\'b4
\f0  or 
\f1 \'95\'fb\'90\'6a\'81\'6a\'82\'f0\'8a\'4f\'82\'b3\'82\'b8\'81\'41\'88\'c0\'90\'53\'8a\'b4\'82\'c6\'8b\'ef\'91\'cc\'90\'ab\'82\'cc\'82\'a0\'82\'e9\'95\'d4\'90\'4d\'95\'b6\'82\'f0\'8d\'ec\'82\'e9\'81\'42
\f0 ",\
      "",\
      "
\f1 \'81\'79\'91\'4f\'92\'f1\'81\'7a
\f0 ",\
      `- 
\f1 \'83\'57\'83\'83\'83\'93\'83\'8b
\f0 : $\{topic\}`,\
      `- 
\f1 \'91\'8a\'8e\'e8\'82\'cc\'8b\'81\'82\'df
\f0 : $\{goal\}`,\
      `- 
\f1 \'95\'d4\'90\'4d\'83\'67\'81\'5b\'83\'93
\f0 : $\{tone\}`,\
      `- 
\f1 \'8f\'49\'97\'b9\'97\'9d\'97\'52
\f0 : $\{reason\}`,\
      "",\
      "
\f1 \'81\'79\'91\'8a\'8e\'e8\'82\'cc\'95\'b6\'96\'ca\'81\'69\'97\'76\'96\'f1
\f0 /
\f1 \'8c\'b4\'95\'b6\'81\'6a\'81\'7a
\f0 ",\
      msg || "
\f1 \'81\'69\'96\'a2\'93\'fc\'97\'cd\'81\'6a
\f0 ",\
      "",\
      "
\f1 \'81\'79\'8e\'9f\'82\'c9\'8a\'6d\'94\'46\'82\'b7\'82\'d7\'82\'ab\'8e\'bf\'96\'e2\'81\'69\'97\'44\'90\'e6\'8f\'87\'81\'6a\'81\'7a
\f0 ",\
      nextQs.map(q => "- " + q).join("\\n"),\
      "",\
      "
\f1 \'81\'79\'8f\'6f\'97\'cd\'82\'b5\'82\'c4\'81\'7a
\f0 ",\
      "1) 
\f1 \'82\'dc\'82\'b8\'88\'ea\'8c\'be\'82\'cc\'8b\'a4\'8a\'b4\'81\'69\'92\'5a\'82\'a2\'81\'6a
\f0 ",\
      "2) 
\f1 \'91\'8a\'8e\'e8\'82\'f0\'90\'d3\'82\'df\'82\'c8\'82\'a2\'8f\'f3\'8b\'b5\'90\'ae\'97\'9d\'81\'69
\f0 2
\f1 \'81\'60
\f0 3
\f1 \'8d\'73\'81\'6a
\f0 ",\
      "3) 
\f1 \'8e\'9f\'82\'c9\'95\'b7\'82\'ad\'8e\'bf\'96\'e2\'82\'f0
\f0 2
\f1 \'82\'c2\'81\'69\'91\'bd\'82\'b7\'82\'ac\'82\'c8\'82\'a2\'81\'6a
\f0 ",\
      "4) 
\f1 \'95\'d4\'90\'4d\'95\'b6\'82\'f0
\f0 3
\f1 \'83\'70\'83\'5e\'81\'5b\'83\'93\'81\'46\'97\'44\'82\'b5\'82\'df
\f0 /
\f1 \'95\'81\'92\'ca
\f0 /
\f1 \'92\'5a\'82\'df
\f0 ",\
      "",\
      "
\f1 \'8b\'d6\'8e\'7e\'81\'46\'92\'66\'92\'e8\'90\'66\'92\'66\'81\'41\'90\'e0\'8b\'b3\'81\'41\'90\'ab\'93\'49\'93\'af\'88\'d3\'82\'aa\'9e\'42\'96\'86\'82\'c8\'82\'c6\'82\'ab\'82\'cc\'93\'a5\'82\'dd\'8d\'9e\'82\'dd\'81\'41\'88\'e3\'97\'c3\'82\'cc\'8c\'88\'82\'df\'82\'c2\'82\'af
\f0 "\
    ].join("\\n");\
  \};\
\
  const resetAll = () => \{\
    history = [];\
    state = \{\};\
    currentId = tree.start;\
    result.classList.add("hidden");\
    qa.classList.remove("hidden");\
    render();\
  \};\
\
  backBtn.onclick = () => \{\
    if (!history.length) return;\
    currentId = history.pop();\
    render();\
  \};\
\
  resetBtn.onclick = resetAll;\
  restartBtn && (restartBtn.onclick = resetAll);\
\
  copyAllBtn.onclick = async () => \{\
    const txt = [\
      "
\f1 \'81\'79\'97\'76\'96\'f1\'81\'7a
\f0 ",\
      summaryEl.textContent,\
      "",\
      "
\f1 \'81\'79\'8e\'9f\'82\'c9\'95\'b7\'82\'ad\'8e\'bf\'96\'e2\'81\'7a
\f0 ",\
      nextQsEl.textContent,\
      "",\
      "
\f1 \'81\'79\'95\'d4\'90\'4d\'81\'69\'97\'44\'82\'b5\'82\'df\'81\'6a\'81\'7a
\f0 ",\
      replySoftEl.textContent,\
      "",\
      "
\f1 \'81\'79\'95\'d4\'90\'4d\'81\'69\'92\'5a\'82\'df\'81\'6a\'81\'7a
\f0 ",\
      replyShortEl.textContent,\
      "",\
      "
\f1 \'81\'79
\f0 ChatGPT
\f1 \'83\'76\'83\'8d\'83\'93\'83\'76\'83\'67\'81\'7a
\f0 ",\
      promptEl.textContent\
    ].join("\\n");\
    try \{\
      await navigator.clipboard.writeText(txt);\
      copyAllBtn.textContent = "
\f1 \'83\'52\'83\'73\'81\'5b\'82\'b5\'82\'bd
\f0 ";\
      setTimeout(() => (copyAllBtn.textContent = "
\f1 \'91\'53\'95\'94\'83\'52\'83\'73\'81\'5b
\f0 "), 1200);\
    \} catch \{\
      alert("
\f1 \'83\'4e\'83\'8a\'83\'62\'83\'76\'83\'7b\'81\'5b\'83\'68\'8c\'a0\'8c\'c0\'82\'aa\'82\'c8\'82\'a2\'82\'c1\'82\'db\'82\'a2\'81\'42\'8e\'e8\'93\'ae\'82\'c5\'83\'52\'83\'73\'83\'79\'82\'b5\'82\'c4\'81\'42
\f0 ");\
    \}\
  \};\
\
  render();\
\})();}