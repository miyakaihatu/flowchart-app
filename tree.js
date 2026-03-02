{\rtf1\ansi\ansicpg932\cocoartf2639
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset128 HiraginoSans-W3;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 window.DECISION_TREE = \{\
  start: "age",\
  nodes: \{\
    age: \{\
      type: "single",\
      question: "
\f1 \'91\'8a\'92\'6b\'8e\'d2\'82\'cd
\f0 18
\f1 \'8d\'ce\'88\'c8\'8f\'e3\'81\'48\'81\'69\'95\'73\'96\'be\'82\'c8\'82\'e7
\f0 \'93
\f1 \'95\'73\'96\'be
\f0 \'94
\f1 \'81\'6a
\f0 ",\
      options: [\
        \{ label: "
\f1 \'82\'cd\'82\'a2\'81\'69
\f0 18
\f1 \'8d\'ce\'88\'c8\'8f\'e3\'81\'6a
\f0 ", value: "adult", next: "topic" \},\
        \{ label: "
\f1 \'82\'a2\'82\'a2\'82\'a6
\f0 /
\f1 \'95\'73\'96\'be
\f0 ", value: "minor_unknown", next: "finish_minor" \}\
      ]\
    \},\
\
    topic: \{\
      type: "single",\
      question: "
\f1 \'91\'8a\'92\'6b\'82\'cc\'83\'57\'83\'83\'83\'93\'83\'8b\'82\'cd\'81\'48
\f0 ",\
      options: [\
        \{ label: "
\f1 \'97\'f6\'88\'a4
\f0 /
\f1 \'90\'6c\'8a\'d4\'8a\'d6\'8c\'57
\f0 ", value: "relationship", next: "goal" \},\
        \{ label: "
\f1 \'91\'cc\'92\'b2
\f0 /
\f1 \'82\'a9\'82\'e7\'82\'be
\f0 ", value: "health", next: "urgency_health" \},\
        \{ label: "
\f1 \'83\'81\'83\'93\'83\'5e\'83\'8b
\f0 /
\f1 \'95\'73\'88\'c0
\f0 ", value: "mental", next: "urgency_mental" \},\
        \{ label: "
\f1 \'90\'ab\'81\'69\'83\'5a\'83\'93\'83\'56\'83\'65\'83\'42\'83\'75\'81\'6a
\f0 ", value: "sensitive", next: "urgency_sensitive" \},\
        \{ label: "
\f1 \'82\'bb\'82\'cc\'91\'bc
\f0 ", value: "other", next: "goal" \}\
      ]\
    \},\
\
    goal: \{\
      type: "single",\
      question: "
\f1 \'91\'8a\'8e\'e8\'82\'aa\'88\'ea\'94\'d4\'8b\'81\'82\'df\'82\'c4\'82\'bb\'82\'a4\'82\'c8\'82\'cc\'82\'cd\'81\'48
\f0 ",\
      options: [\
        \{ label: "
\f1 \'82\'c6\'82\'c9\'82\'a9\'82\'ad\'98\'62\'82\'f0\'95\'b7\'82\'a2\'82\'c4\'82\'d9\'82\'b5\'82\'a2\'81\'69\'8b\'a4\'8a\'b4\'81\'6a
\f0 ", value: "listen", next: "tone" \},\
        \{ label: "
\f1 \'83\'41\'83\'68\'83\'6f\'83\'43\'83\'58\'82\'aa\'82\'d9\'82\'b5\'82\'a2\'81\'69\'95\'fb\'90\'6a\'81\'6a
\f0 ", value: "advice", next: "tone" \},\
        \{ label: "
\f1 \'8b\'ef\'91\'cc\'93\'49\'82\'c8\'8e\'e8\'8f\'87
\f0 /
\f1 \'83\'76\'83\'89\'83\'93\'82\'aa\'82\'d9\'82\'b5\'82\'a2
\f0 ", value: "plan", next: "tone" \},\
        \{ label: "
\f1 \'82\'e6\'82\'ad\'95\'aa\'82\'a9\'82\'e7\'82\'c8\'82\'a2
\f0 ", value: "unknown", next: "tone" \}\
      ]\
    \},\
\
    tone: \{\
      type: "single",\
      question: "
\f1 \'82\'a0\'82\'c8\'82\'bd\'82\'cc\'95\'d4\'93\'9a\'82\'cc\'95\'b5\'88\'cd\'8b\'43\'82\'cd\'81\'48\'81\'69\'95\'81\'92\'69\'82\'cc\'82\'a0\'82\'c8\'82\'bd\'82\'c5
\f0 OK
\f1 \'81\'6a
\f0 ",\
      options: [\
        \{ label: "
\f1 \'82\'e2\'82\'ed\'82\'e7\'82\'a9\'82\'ad\'88\'c0\'90\'53\'8a\'b4
\f0 ", value: "soft", next: "context" \},\
        \{ label: "
\f1 \'95\'81\'92\'ca\'81\'69\'92\'9a\'94\'4a\'82\'be\'82\'af\'82\'c7\'8c\'79\'82\'a2\'81\'6a
\f0 ", value: "normal", next: "context" \},\
        \{ label: "
\f1 \'92\'5a\'82\'ad\'97\'76\'93\'5f\'82\'be\'82\'af
\f0 ", value: "short", next: "context" \}\
      ]\
    \},\
\
    context: \{\
      type: "text",\
      question: "
\f1 \'91\'8a\'8e\'e8\'82\'cc\'95\'b6\'96\'ca\'82\'f0\'92\'5a\'82\'ad\'97\'76\'96\'f1\'82\'b5\'82\'c4\'93\'5c\'82\'c1\'82\'c4\'81\'69\'83\'52\'83\'73\'83\'79\'82\'c5\'82\'e0
\f0 OK
\f1 \'81\'6a
\f0 ",\
      key: "message",\
      next: "finish"\
    \},\
\
    // --- 
\f1 \'8a\'65\'83\'57\'83\'83\'83\'93\'83\'8b\'82\'cc
\f0 \'93
\f1 \'8a\'eb\'8c\'af\'90\'4d\'8d\'86
\f0 \'94
\f1 \'83\'60\'83\'46\'83\'62\'83\'4e\'81\'69\'8e\'47\'82\'c9\'8c\'a9\'82\'a6\'82\'c4\'92\'b4\'8f\'64\'97\'76\'81\'6a
\f0  ---\
    urgency_health: \{\
      type: "single",\
      question: "
\f1 \'91\'cc\'92\'b2\'8c\'6e\'81\'46\'8b\'ad\'82\'a2\'92\'c9\'82\'dd
\f0 /
\f1 \'8f\'6f\'8c\'8c
\f0 /
\f1 \'94\'ad\'94\'4d
\f0 /
\f1 \'8b\'7d\'8c\'83\'82\'c8\'88\'ab\'89\'bb\'82\'c8\'82\'c7\'81\'41\'8e\'f3\'90\'66\'83\'8c\'83\'78\'83\'8b\'82\'cc\'89\'c2\'94\'5c\'90\'ab\'82\'cd\'81\'48
\f0 ",\
      options: [\
        \{ label: "
\f1 \'82\'a0\'82\'e8\'82\'bb\'82\'a4
\f0 ", value: "red", next: "goal" \},\
        \{ label: "
\f1 \'82\'bd\'82\'d4\'82\'f1\'82\'c8\'82\'a2
\f0 ", value: "green", next: "goal" \}\
      ]\
    \},\
\
    urgency_mental: \{\
      type: "single",\
      question: "
\f1 \'83\'81\'83\'93\'83\'5e\'83\'8b\'8c\'6e\'81\'46\'8e\'a9\'8f\'9d
\f0 /
\f1 \'8a\'f3\'8e\'80\'94\'4f\'97\'b6
\f0 /
\f1 \'8a\'eb\'8c\'af\'8d\'73\'93\'ae\'82\'c1\'82\'db\'82\'a2\'93\'f5\'82\'a2\'82\'cd\'81\'48
\f0 ",\
      options: [\
        \{ label: "
\f1 \'82\'a0\'82\'e8\'82\'bb\'82\'a4
\f0 ", value: "red", next: "finish_crisis" \},\
        \{ label: "
\f1 \'82\'bd\'82\'d4\'82\'f1\'82\'c8\'82\'a2
\f0 ", value: "green", next: "goal" \}\
      ]\
    \},\
\
    urgency_sensitive: \{\
      type: "single",\
      question: "
\f1 \'83\'5a\'83\'93\'83\'56\'83\'65\'83\'42\'83\'75\'81\'46\'92\'c9\'82\'dd
\f0 /
\f1 \'89\'8a\'8f\'c7
\f0 /
\f1 \'96\'b3\'97\'9d\'82\'b5\'82\'c4\'82\'e9
\f0 /
\f1 \'93\'af\'88\'d3\'82\'aa\'9e\'42\'96\'86
\f0  
\f1 \'82\'dd\'82\'bd\'82\'a2\'82\'c8\'97\'76\'91\'66\'82\'cd\'81\'48
\f0 ",\
      options: [\
        \{ label: "
\f1 \'82\'a0\'82\'e8\'82\'bb\'82\'a4
\f0 ", value: "red", next: "goal" \},\
        \{ label: "
\f1 \'82\'bd\'82\'d4\'82\'f1\'82\'c8\'82\'a2
\f0 ", value: "green", next: "goal" \}\
      ]\
    \},\
\
    // --- 
\f1 \'8f\'49\'97\'b9\'83\'6d\'81\'5b\'83\'68
\f0  ---\
    finish_minor: \{ type: "finish", reason: "minor_unknown" \},\
    finish_crisis: \{ type: "finish", reason: "crisis" \},\
    finish: \{ type: "finish", reason: "normal" \}\
  \}\
\};}