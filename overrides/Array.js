Ext.define('Thot.overrides.Array', {
        requires: 'Ext.Array'
    },
    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    Ext.Array.getIndex = function (aArray, sProperty, sValue) {
        var iIndex = null;

        for (var iInd in aArray) {
            if (aArray[iInd][sProperty]) {
                if (aArray[iInd][sProperty] == sValue) {
                    iIndex = iInd;
                    break;
                }
            }
        }
        return iIndex;
    }
);

// override: 'Ext.Array',
// /**
//  * @author : edblv
//  * date   :
//  * @scrum : RND#ND-ND.ND
//  *
//  * #Description
//  *
//  *
//  * @version JJMMAA edblv RND#ND-ND.ND Création
//  */
// getIndex: function (aArray, sProperty, sValue) {
// 	var iIndex = null;

// 	for (var iInd in aArray) {
// 		if (aArray[iInd][sProperty]) {
// 			if (aArray[iInd][sProperty]==sValue) {
// 				iIndex = iInd;
// 				break;
// 			}
// 		}
// 	}

// 	return iIndex;
// }