"""WIP Figure generator to visualize Spotify features."""
import plotly.graph_objects as go
import json


with open('figures/current_features.json') as f:
  data = json.load(f)

print(data.items())

fig = go.Figure([go.Bar(x=list(data.keys()), y=list(data.values()), marker_color="firebrick")])
fig.update_layout(yaxis_range=[0,1])
# fig.update_layout(paper_bgcolor='rgba(0,0,0,0)')
# fig.update_layout(plot_bgcolor='rgba(0,0,0,0)')
fig.write_image("figures/auto.png")