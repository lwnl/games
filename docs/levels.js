const levels =
[
  {
    levelNumber: 0,
    matrix: {rows: 9, cols:8},
    playerCoordinate:[3, 3],
    outsideCoordinatesArray:[
      [1, 1], [1, 2],                                         [1, 8],  
                                                              [2, 8],
                                                              [3, 8],
                                                              [4, 8],
                                                              [5, 8],
      ],
    wallCoordinatesArray:[
                      [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], 
      [2, 1], [2, 2], [2, 3],                         [2, 7],
      [3, 1],                                         [3, 7],
      [4, 1], [4, 2], [4, 3],                         [4, 7],
      [5, 1],         [5, 3], [5, 4],                 [5, 7],
      [6, 1],         [6, 3],                         [6, 7], [6, 8],
      [7, 1],                                                 [7, 8],
      [8, 1],                                                 [8, 8],
      [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8],  
      ],
    boxCoordinatesArray:[
                              [3, 4], 
                                      [4, 5], 
                                      [5, 5], 
      
              [7, 2],         [7, 4], [7, 5], [7, 6], 
    ],
    targetCoordinatesArray:[
              [3, 2], 
                                              [4, 6],  
              [5, 2],   
                                      [6, 5], 
                              [7, 4],                 [7, 7],  
                                      [8, 5], 
    ],
  },
  {
    levelNumber: 1,
    matrix: {rows: 4, cols:7},
    playerCoordinate:[3, 3],
    outsideCoordinatesArray:[
      [1, 1], [1, 2],                                         
      ],
    wallCoordinatesArray:[
                      [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], 
      [2, 1], [2, 2], [2, 3],                         [2, 7],
      [3, 1],                                         [3, 7],
      [4, 1], [4, 2], [4, 3],                         [4, 7],
      ],
    boxCoordinatesArray:[
                              [3, 4], 
                                      [4, 5], 
    ],
    targetCoordinatesArray:[
              [3, 2], 
                                              [4, 6],  
    ],
  },
]       
  
export default levels;