# Input file: Time  fuseDescription \n sensorId \n concentratorId \n gatewayId
import json


# Fuses.json

# currLineType = 0
# fuses = {"fuseName": {"sensorId": 1, "concentratorId": 1, "gatewayId": 1}}
# with open("SampleData.txt") as fp: 
    # fuse = ""
    # for line in fp:
    
        # if line[-1:] == "\n":
            # line = line[:len(line)-1]
        
        # if currLineType == 0:
            # fuse = line[26:]
            # if not fuse in fuses:
                # fuses[fuse] = {"sensorId": [], "concentratorId": [], "gatewayId": []}
        # elif currLineType == 1:
            # if line not in fuses[fuse]["sensorId"]:
                # fuses[fuse]["sensorId"].append(line)
        # elif currLineType == 2:
            # if line not in fuses[fuse]["concentratorId"]:
                # fuses[fuse]["concentratorId"].append(line)
        # else:
            # if line not in fuses[fuse]["gatewayId"]:
                # fuses[fuse]["gatewayId"].append(line)
             
        # currLineType = (currLineType + 1) % 4
        
# with open('fuses.json', 'w') as fp:
    # json.dump(fuses, fp)
    
    
    
# SensorID -> FuseDescription

# currLineType = 0
# sensorIds = {}
# with open("SampleData.txt") as fp: 
    # fuse = ""
    # for line in fp:
    
        # if line[-1:] == "\n":
            # line = line[:len(line)-1]
        
        # if currLineType == 0:
            # fuse = line[26:]
        # elif currLineType == 1:
            # if line not in sensorIds:
                # sensorIds[line] = fuse
        
        # currLineType = (currLineType + 1) % 4
# with open('sensorIds.json', 'w') as fp:
    # json.dump(sensorIds, fp)
    
    
# SensorId -> UsageCategories

sensorIds = {}
with open("fusesUsageCategories.txt") as fp: 
    sensorId = ""
    for line in fp:
    
        if line[-1:] == "\n":
            line = line[:len(line)-1]
        
        if line.startswith("Mar"):
            sensorId = line[26:]
        else:
            if sensorId not in sensorIds:
                sensorIds[sensorId] = line.split(", ")
            else:
                for cat in line.split(", "):
                    if cat not in sensorIds[sensorId]:
                        sensorIds[sensorId].append(cat)

with open('usageCats.json', 'w') as fp:
    json.dump(sensorIds, fp)
    