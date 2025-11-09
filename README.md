# Powered Garden — AI Garden Dashboard

Lovable handles the visual design for this project. Cursor (or any local IDE) is used to integrate live Raspberry Pi telemetry (`latest.json`), debug, and deploy the static build onto the Pi.

---

## 1. Design ↔ Code workflow

1. **Design in Lovable**  
   Project URL: https://lovable.dev/projects/5b674266-9311-498d-a67d-ca452a416d3f  
   Whenever you publish/save, Lovable commits to this GitHub repository.
2. **Pull into Cursor**  
   git clone https://github.com/ecee-ai-builds/powered-garden.git  
   cd powered-garden  
   git pull   # run this each time after updating in Lovable  
   npm install
3. **Develop & Debug**  
   - Live dev server (with live sensor JSON support):  
     SENSOR_DATA_PATH=/home/esther/ai_garden/latest.json npm run dev -- --host 0.0.0.0 --port 5173  
   - Visit `http://<pi-ip>:5173` from any LAN device while the Pi sensor script is running (`~/ai_garden/dht22_latest.py`).  
   - The app polls `/latest.json` every 2.5 s and drives all dashboard widgets through `useSensorData`.
4. **Push back to Lovable**  
   Commit/merge your Cursor changes and push. Lovable will pull the latest on the next publish.

---

## 2. Deployment to Raspberry Pi

```bash
# On your workstation (within the repo)
npm run build
rsync -av dist/ pi@<pi-ip>:~/ai_garden/powered-garden-dist/

# On the Pi
ssh pi@<pi-ip>
cd ~/ai_garden
python -m http.server 8080 --directory powered-garden-dist
# or: npx serve -s powered-garden-dist -l 8080
```

Open `http://<pi-ip>:8080/powered-garden-dist/` on the LAN to view the production build.  
Tip: create a `systemd` unit for both the sensor loop and the static server to survive reboots.

---

## 3. Environment Variables

| Variable                  | Purpose                                               | Default        |
| ------------------------- | ----------------------------------------------------- | -------------- |
| VITE_SENSOR_URL           | Remote endpoint if latest.json is hosted elsewhere    | /latest.json   |
| VITE_SENSOR_REFRESH_MS    | Polling cadence in milliseconds                       | 2500           |
| SENSOR_DATA_PATH          | Filesystem path to latest.json for the dev middleware | ../latest.json |
| VITE_GROW_CHAT_URL        | Absolute URL to the deployed Supabase edge function   | http://localhost:54321/functions/v1/grow-chat |

> Set `VITE_GROW_CHAT_URL` to your Supabase functions URL in production, e.g. `https://<project>.functions.supabase.co/grow-chat`.

---

## 4. Grow Assistant Backend (Supabase Edge Function)

The chat experience calls a Supabase edge function (`supabase/functions/grow-chat`).

1. Install the Supabase CLI if you have not already: `npm install -g supabase`.
2. Authenticate: `supabase login`.
3. Link to your Supabase project: `supabase link --project-ref <project-ref>`.
4. Deploy the function: `supabase functions deploy grow-chat`.
5. Set the Lovable AI key for the function runtime:
   ```bash
   supabase secrets set LOVABLE_API_KEY=your_lovable_api_key
   ```
6. Configure the dashboard by setting `VITE_GROW_CHAT_URL` to the deployed endpoint.

The function embeds the Malaysia-focused plant dataset and returns concise guidance tailored to the currently selected crop. When the network call fails, the UI falls back to built-in setpoint guidance so users still receive actionable help.

---

## 5. Project Structure Highlights

```
src/
├── components/grow/          # Chat UI building blocks
├── context/SensorContext.tsx # wraps the app with live sensor state
├── data/plantCards.ts        # Malaysia-focused plant dataset
├── hooks/useGrowAssistant.ts # chat state + backend integration
├── pages/Chat.tsx            # Grow Assistant surface
├── pages/Command.tsx         # Lovable-designed dashboard using live telemetry
└── types/
    ├── plants.ts             # shared plant interfaces
    └── sensor.ts             # sensor payload shape
```

---

## 6. Troubleshooting

* **No readings?** Ensure `~/ai_garden/latest.json` is updating and the dev server can read it (`SENSOR_DATA_PATH`).
* **CORS issues in dev?** Run `npm run dev` on the Pi or use the provided middleware to serve `latest.json` locally.
* **Chat errors?** Check the Supabase function logs (`supabase functions logs grow-chat`) and confirm `LOVABLE_API_KEY` + `VITE_GROW_CHAT_URL` are set.
* **UI drift after Lovable edits?** Pull the repo in Cursor before coding to align with the newest generated components.
* **Need history/charts?** Extend `useSensorData` or add new hooks/components; run `npm run lint` / `npm run build` to verify before deployment.

---

## 7. References

* Lovable project: https://lovable.dev/projects/5b674266-9311-498d-a67d-ca452a416d3f
* Sensor loop: `~/ai_garden/sensor/dht22_latest.py`
* Live data file: `~/ai_garden/latest.json`
* Supabase docs: https://supabase.com/docs/guides/functions
