"""WIP Figure generator to visualize Spotify features."""
import plotly.graph_objects as go
import plotly.express as px
import json
import pandas as pd
import time


with open('figures/current_features.json') as f:
    data = json.load(f)

fig = go.Figure([go.Bar(x=list(data.keys()), y=list(
    data.values()), marker_color="firebrick")])
fig.update_layout(yaxis_range=[0, 1])
# fig.update_layout(paper_bgcolor='rgba(0,0,0,0)')
# fig.update_layout(plot_bgcolor='rgba(0,0,0,0)')
fig.write_image("figures/auto.png")

df = pd.DataFrame(data, index=['i', ])
year, month, day, hour, minute = map(
    int, time.strftime("%Y %m %d %H %M").split())
df['date'] = f'{year}-{month}-{day}-{hour}:{minute}'
df.to_csv('figures/ongoing_features.csv', mode='a', header=False)

df = pd.read_csv('figures/ongoing_features.csv', index_col=0)
fig = px.line(df, x="date", y=df.columns[:-1],
              hover_data={"date": "|%B %d, %Y"},
              title='ongoing listening mood')
fig.update_layout(paper_bgcolor='rgba(0,0,0,0)')
fig.update_layout(plot_bgcolor='rgba(0,0,0,0)')
fig.write_image('figures/timeseries.png')
