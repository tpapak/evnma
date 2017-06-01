module Main.Update where

import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log, logShow)
import Data.Foreign
import Data.Maybe (Maybe(..))
import Data.Either (Either(..))
import Data.Traversable
import Data.Lens
import Data.Lens.Record (prop)
import Data.Lens.Zoom (Traversal, Traversal', Lens, Lens', zoom)

import Main.View
import Actions
import Model
import TextModel
import SaveModel
import ReportModel


readLevels :: Foreign -> Array ReportLevel
readLevels f = do
  {--let rulesTexts = (readState f) ^. _State <<< text <<< _TextContent--}
                     {--<<< reportText <<< _ReportText--}
                     {--<<< reportRulesText--}
  []

updateState :: forall eff. Foreign -> Eff (console :: CONSOLE 
                   , modelOut :: SAVE_STATE 
                   | eff
                   ) Unit
updateState mdl = do
  let (s :: Either String State) = readState mdl
  case s of
    Left err -> do saveState $ Report { status : "notReady", levels: [] }
                   logShow $ "reading state in Report error: " <> err
    Right st -> do
      if isReady st then do
          saveState $ skeletonReport
          {--let rows = foldl (<>) "" $ map (\c -> isSelectedComparison c--}
          {--                (getSelected st) <> "\n" ) (getDirects st)  --}
          {--log $ "Report Ready selected rows" <> rows--}
          log $ "Report Ready"
        else do
          saveState $ Report { status : "notReady"
                             , levels : [] }
          log $ "Report Not Ready"
