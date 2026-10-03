{{- define "cosmic-frontend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "cosmic-frontend.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name (include "cosmic-frontend.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{- define "cosmic-frontend.labels" -}}
app.kubernetes.io/name: {{ include "cosmic-frontend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Values.image.tag | default .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: cosmic-facts
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version }}
{{- end }}

{{- define "cosmic-frontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cosmic-frontend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
