# Social-Network-Links-Prediction
Tongji Data Structure Project - Social Network Links Prediction

## Languages & Packages & Frameworks
- `javascript`, `python`
- `echarts`, `bootstrap`, `ajax`, `networkx`
- `Django`

## Environment Setup

create virtual environment in `conda` (env name: social_network)
```cmd
cd network_demo
conda env create -f environment.yaml
conda activate social_network
```


## Quick Start
An overview
![Overview](\pages\overview.png)


enter the folder with `manage.py` then start service
```cmd
cd network_demo
python manage.py runserver
```
![Initial view](\pages\initial.png)


scale background graph by scrolling
click on categories at the top of the page
![Scaling & category shifting](\pages\scale.png)
> features implemented in echarts


click on cards in the left sidebar, profile displayed on the right sidebar
![detailed info](\pages\details.png)


select Algorithms (default to `Intersection`) and Mode (default to `All Users`) at the bottom of Detailed infomation
![select](\pages\algorithms.png)


`All user` mode
![All User mode](\pages\all_users.png)


`target user` mode
![target mode](\pages\target_user.png)


wrong input get warnings
![warnings](\pages\warnings.png)


manage your page with control island
![manage your page](\pages\page_management.png)


upload your `JSON` file at `Custom`
![Upload your file](\pages\upload.png)

new graph loaded
![new graph](\pages\new_graph.png)


return to Defalut graph at `Default`
![default](\pages\default.png)














