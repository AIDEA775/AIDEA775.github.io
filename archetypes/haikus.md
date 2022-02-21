---
title: {{ substr (replace .Name "-" " ") 4 | title }}
date: {{ now.Format "2006-01-02" }}
draft: false
---
