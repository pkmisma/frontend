{{- define "rsf.fullname" -}}
{{- if contains .Chart.Name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "rsf.selectorLabels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "rsf.labels" -}}
{{ include "rsf.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version }}
environment: {{ .Values.environment | quote }}
{{- end -}}

{{/* image.full (e.g. from Harness <+artifact.image>) wins over repository:tag */}}
{{- define "rsf.image" -}}
{{- if .Values.image.full -}}
{{- .Values.image.full -}}
{{- else -}}
{{- printf "%s:%s" .Values.image.repository (default .Chart.AppVersion .Values.image.tag) -}}
{{- end -}}
{{- end -}}
{{/* Namespace comes from values; falls back to the Helm release namespace if empty */}}
{{- define "rsf.namespace" -}}
{{- default .Release.Namespace .Values.namespace -}}
{{- end -}}